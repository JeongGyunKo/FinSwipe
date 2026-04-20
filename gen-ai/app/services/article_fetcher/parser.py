from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from html.parser import HTMLParser
from typing import Protocol

from app.schemas.article_fetch import ArticleTextSource


ARTICLE_TYPES = {
    "article",
    "newsarticle",
    "report",
    "analysisnewsarticle",
    "blogposting",
}
NEGATIVE_ATTR_HINTS = {
    "ad",
    "ads",
    "banner",
    "comment",
    "footer",
    "header",
    "hero",
    "menu",
    "nav",
    "newsletter",
    "promo",
    "recommended",
    "related",
    "share",
    "sidebar",
    "subscription",
}
POSITIVE_ATTR_HINTS = {
    "article",
    "article-body",
    "article-content",
    "article-text",
    "body",
    "content",
    "main",
    "post",
    "story",
}
PREFERRED_BLOCK_TAGS = {"article", "main", "section", "div", "p"}
LINE_BREAK_TAGS = {"article", "main", "section", "div", "p", "br", "li"}
IGNORE_TAGS = {"script", "style", "noscript", "svg"}
JSON_LD_TYPE = "application/ld+json"
GENERIC_JSON_TYPES = {"application/json", "application/vnd.api+json"}


class ArticleHTMLParser(Protocol):
    """Interface for transforming fetched HTML into article text."""

    def extract_text(self, html: str) -> str:
        """Return article text extracted from a raw HTML document."""

    def extract_result(self, html: str) -> "ArticleParseResult":
        """Return article text plus extraction diagnostics."""


@dataclass(frozen=True, slots=True)
class ArticleParseResult:
    text: str
    source: ArticleTextSource | None = None


@dataclass(slots=True)
class _BlockContext:
    tag: str
    attrs: dict[str, str]
    start_order: int
    text_parts: list[str] = field(default_factory=list)
    anchor_text_length: int = 0

    def append_text(self, text: str, *, inside_anchor: bool) -> None:
        self.text_parts.append(text)
        if inside_anchor:
            self.anchor_text_length += len(text)

    def combined_text(self) -> str:
        return "".join(self.text_parts)


@dataclass(slots=True)
class _CandidateBlock:
    tag: str
    attrs: dict[str, str]
    text: str
    score: float
    order: int


class _ArticleSignalExtractor(HTMLParser):
    """Collect structured-data, paragraph, and container candidates from article HTML."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._ignore_depth = 0
        self._script_type_stack: list[str] = []
        self._json_buffer_stack: list[tuple[str, list[str]] | None] = []
        self._anchor_depth = 0
        self._block_stack: list[_BlockContext] = []
        self._block_order = 0
        self._candidates: list[_CandidateBlock] = []
        self._meta_descriptions: list[str] = []
        self._json_ld_texts: list[str] = []
        self._generic_json_texts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = {key.lower(): (value or "") for key, value in attrs}
        lower_tag = tag.lower()

        if lower_tag in IGNORE_TAGS:
            self._ignore_depth += 1
            if lower_tag == "script":
                script_type = attr_map.get("type", "").split(";")[0].strip().lower()
                script_id = attr_map.get("id", "").strip().lower()
                self._script_type_stack.append(script_type)
                self._json_buffer_stack.append(
                    self._build_script_buffer(script_type=script_type, script_id=script_id)
                )
            return

        if self._ignore_depth > 0:
            return

        if lower_tag == "meta":
            self._capture_meta_description(attr_map)
            return

        if lower_tag == "a":
            self._anchor_depth += 1

        if lower_tag in PREFERRED_BLOCK_TAGS:
            self._block_stack.append(
                _BlockContext(
                    tag=lower_tag,
                    attrs=attr_map,
                    start_order=self._block_order,
                )
            )
            self._block_order += 1

        if lower_tag in LINE_BREAK_TAGS:
            self._append_to_blocks("\n")

    def handle_endtag(self, tag: str) -> None:
        lower_tag = tag.lower()

        if lower_tag in IGNORE_TAGS:
            if lower_tag == "script":
                script_type = self._script_type_stack.pop() if self._script_type_stack else ""
                script_buffer = self._json_buffer_stack.pop() if self._json_buffer_stack else None
                if script_buffer is not None:
                    buffer_kind, buffer_parts = script_buffer
                    raw_json = "".join(buffer_parts)
                    if buffer_kind == JSON_LD_TYPE:
                        self._json_ld_texts.extend(_extract_article_texts_from_json_ld(raw_json))
                    elif buffer_kind == "generic_json":
                        self._generic_json_texts.extend(
                            _extract_article_texts_from_generic_json(raw_json)
                        )

            if self._ignore_depth > 0:
                self._ignore_depth -= 1
            return

        if self._ignore_depth > 0:
            return

        if lower_tag == "a" and self._anchor_depth > 0:
            self._anchor_depth -= 1

        if lower_tag in LINE_BREAK_TAGS:
            self._append_to_blocks("\n")

        if lower_tag in PREFERRED_BLOCK_TAGS:
            block = self._pop_block(lower_tag)
            if block is not None:
                self._store_candidate(block)

    def handle_data(self, data: str) -> None:
        if self._ignore_depth > 0:
            if self._json_buffer_stack and self._json_buffer_stack[-1] is not None:
                self._json_buffer_stack[-1][1].append(data)
            return

        if not data:
            return
        self._append_to_blocks(data)

    def extract_best_text(self) -> ArticleParseResult:
        structured_text = _join_distinct_chunks(self._json_ld_texts)
        generic_json_text = _join_distinct_chunks(self._generic_json_texts)
        paragraph_text = self._build_paragraph_text()
        container_text = self._build_container_text()
        meta_text = _join_distinct_chunks(self._meta_descriptions)
        best_candidate = self._best_candidate()
        candidates = [
            ArticleParseResult(text=structured_text, source=ArticleTextSource.JSON_LD),
            ArticleParseResult(text=generic_json_text, source=ArticleTextSource.GENERIC_JSON),
            ArticleParseResult(text=paragraph_text, source=ArticleTextSource.PARAGRAPH_BLOCKS),
            ArticleParseResult(text=container_text, source=ArticleTextSource.CONTAINER_BLOCK),
            ArticleParseResult(text=meta_text, source=ArticleTextSource.META_DESCRIPTION),
            ArticleParseResult(
                text=best_candidate.text if best_candidate is not None else "",
                source=ArticleTextSource.BEST_CANDIDATE if best_candidate is not None else None,
            ),
        ]
        return _select_best_extracted_result(candidates)

    def _append_to_blocks(self, text: str) -> None:
        for block in self._block_stack:
            block.append_text(text, inside_anchor=self._anchor_depth > 0)

    def _capture_meta_description(self, attrs: dict[str, str]) -> None:
        name = attrs.get("name", "").lower()
        property_name = attrs.get("property", "").lower()
        content = attrs.get("content", "").strip()
        if not content:
            return

        if name in {"description", "twitter:description"}:
            self._meta_descriptions.append(content)
        elif property_name in {"og:description", "article:description"}:
            self._meta_descriptions.append(content)

    def _build_script_buffer(
        self,
        *,
        script_type: str,
        script_id: str,
    ) -> tuple[str, list[str]] | None:
        if script_type == JSON_LD_TYPE:
            return (JSON_LD_TYPE, [])
        if script_type in GENERIC_JSON_TYPES or script_id == "__next_data__":
            return ("generic_json", [])
        return None

    def _pop_block(self, tag: str) -> _BlockContext | None:
        for index in range(len(self._block_stack) - 1, -1, -1):
            if self._block_stack[index].tag == tag:
                return self._block_stack.pop(index)
        return None

    def _store_candidate(self, block: _BlockContext) -> None:
        cleaned_text = _normalize_extracted_text(block.combined_text())
        if not cleaned_text:
            return

        score = _score_candidate(
            tag=block.tag,
            attrs=block.attrs,
            text=cleaned_text,
            anchor_text_length=block.anchor_text_length,
        )
        if score <= 0:
            return

        self._candidates.append(
            _CandidateBlock(
                tag=block.tag,
                attrs=block.attrs,
                text=cleaned_text,
                score=score,
                order=block.start_order,
            )
        )

    def _build_paragraph_text(self) -> str:
        paragraphs = [
            candidate
            for candidate in self._candidates
            if candidate.tag == "p" and len(candidate.text) >= 45
        ]
        paragraphs.sort(key=lambda item: item.order)
        return _join_distinct_chunks([item.text for item in paragraphs])

    def _build_container_text(self) -> str:
        containers = [
            candidate
            for candidate in self._candidates
            if candidate.tag in {"article", "main", "section", "div"}
        ]
        containers.sort(key=lambda item: (-item.score, item.order))

        for candidate in containers:
            if _looks_like_article_text(candidate.text):
                return candidate.text
        return ""

    def _best_candidate(self) -> _CandidateBlock | None:
        if not self._candidates:
            return None
        return max(self._candidates, key=lambda item: (item.score, -item.order))


class SimpleHTMLArticleParser:
    """Extract article text with structured-data, paragraph, and container fallbacks."""

    def extract_text(self, html: str) -> str:
        return self.extract_result(html).text

    def extract_result(self, html: str) -> ArticleParseResult:
        extractor = _ArticleSignalExtractor()
        extractor.feed(html)
        extractor.close()
        result = extractor.extract_best_text()
        return ArticleParseResult(
            text=result.text.strip(),
            source=result.source,
        )


def _extract_article_texts_from_json_ld(raw_json: str) -> list[str]:
    cleaned_json = raw_json.strip()
    if not cleaned_json:
        return []

    try:
        payload = json.loads(cleaned_json)
    except json.JSONDecodeError:
        return []

    texts: list[str] = []
    for node in _iterate_json_nodes(payload):
        if not isinstance(node, dict):
            continue
        node_type = str(node.get("@type", "")).replace(" ", "").lower()
        if node_type not in ARTICLE_TYPES:
            continue

        article_body = node.get("articleBody")
        if isinstance(article_body, str) and article_body.strip():
            texts.append(article_body)

        description = node.get("description")
        if isinstance(description, str) and description.strip():
            texts.append(description)

    return [_normalize_extracted_text(text) for text in texts if _normalize_extracted_text(text)]


def _extract_article_texts_from_generic_json(raw_json: str) -> list[str]:
    cleaned_json = raw_json.strip()
    if not cleaned_json:
        return []

    try:
        payload = json.loads(cleaned_json)
    except json.JSONDecodeError:
        return []

    candidates: list[str] = []
    for node in _iterate_json_nodes(payload):
        if isinstance(node, dict):
            candidates.extend(_collect_candidate_texts_from_dict(node))

    normalized_candidates = [
        _normalize_extracted_text(candidate)
        for candidate in candidates
        if _normalize_extracted_text(candidate)
    ]
    deduped = _dedupe_preserving_order(normalized_candidates)
    return [
        candidate
        for candidate in deduped
        if _looks_like_short_article_text(candidate) or len(candidate.split()) >= 8
    ]


def _iterate_json_nodes(value: object):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from _iterate_json_nodes(child)
    elif isinstance(value, list):
        for item in value:
            yield from _iterate_json_nodes(item)


def _collect_candidate_texts_from_dict(node: dict[object, object]) -> list[str]:
    candidates: list[str] = []

    article_type = str(node.get("@type", "")).replace(" ", "").lower()
    if article_type in ARTICLE_TYPES:
        candidates.extend(_extract_text_fields(node))

    keys = {str(key).lower() for key in node.keys()}
    if keys & {
        "articlebody",
        "body",
        "content",
        "description",
        "summary",
        "text",
        "paragraphs",
        "contents",
    }:
        candidates.extend(_extract_text_fields(node))

    return candidates


def _extract_text_fields(node: dict[object, object]) -> list[str]:
    candidates: list[str] = []
    text_like_keys = {
        "articleBody",
        "body",
        "content",
        "description",
        "summary",
        "text",
    }
    list_like_keys = {"paragraphs", "contents", "items"}

    for key in text_like_keys:
        value = node.get(key)
        if isinstance(value, str) and value.strip():
            candidates.append(value)

    for key in list_like_keys:
        value = node.get(key)
        if isinstance(value, list):
            joined = _join_text_fragments(value)
            if joined:
                candidates.append(joined)

    return candidates


def _join_text_fragments(items: list[object]) -> str:
    fragments: list[str] = []
    for item in items:
        if isinstance(item, str) and item.strip():
            fragments.append(item.strip())
            continue
        if isinstance(item, dict):
            for key in ("text", "content", "body", "description"):
                value = item.get(key)
                if isinstance(value, str) and value.strip():
                    fragments.append(value.strip())
                    break
    return " ".join(fragments).strip()


def _dedupe_preserving_order(items: list[str]) -> list[str]:
    seen: set[str] = set()
    deduped: list[str] = []
    for item in items:
        if item in seen:
            continue
        seen.add(item)
        deduped.append(item)
    return deduped


def _score_candidate(
    *,
    tag: str,
    attrs: dict[str, str],
    text: str,
    anchor_text_length: int,
) -> float:
    attr_blob = " ".join(
        value.lower()
        for key, value in attrs.items()
        if key in {"id", "class", "itemprop", "role", "data-testid", "aria-label"}
    )
    lower_text = text.lower()
    text_length = len(text)
    line_count = len([line for line in text.splitlines() if line.strip()])
    punctuation_count = sum(text.count(mark) for mark in {".", ",", ";", ":"})
    anchor_ratio = anchor_text_length / max(text_length, 1)

    score = 0.0
    score += min(text_length / 180, 8.0)
    score += min(line_count * 0.5, 4.0)
    score += min(punctuation_count * 0.15, 3.0)

    if tag == "article":
        score += 10.0
    elif tag == "main":
        score += 7.0
    elif tag == "section":
        score += 3.0
    elif tag == "p":
        score += 6.0
    elif tag == "div":
        score += 1.5

    if any(hint in attr_blob for hint in POSITIVE_ATTR_HINTS):
        score += 6.0
    if any(hint in attr_blob for hint in NEGATIVE_ATTR_HINTS):
        score -= 8.0

    if "copyright" in lower_text or "all rights reserved" in lower_text:
        score -= 6.0
    if "subscribe" in lower_text or "sign up" in lower_text:
        score -= 5.0

    if anchor_ratio > 0.55:
        score -= 8.0
    elif anchor_ratio > 0.3:
        score -= 4.0

    return score


def _normalize_extracted_text(text: str) -> str:
    normalized = text.replace("\xa0", " ")
    normalized = re.sub(r"[ \t]+", " ", normalized)
    normalized = re.sub(r" *\n *", "\n", normalized)
    normalized = re.sub(r"\n{3,}", "\n\n", normalized)
    return normalized.strip()


def _join_distinct_chunks(chunks: list[str]) -> str:
    result: list[str] = []
    seen: set[str] = set()

    for chunk in chunks:
        normalized = _normalize_extracted_text(chunk)
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        result.append(normalized)

    return "\n\n".join(result).strip()


def _looks_like_article_text(text: str) -> bool:
    normalized = _normalize_extracted_text(text)
    if len(normalized) < 120:
        return False

    sentence_count = len(re.findall(r"[.!?](?:\s|$)", normalized))
    word_count = len(normalized.split())
    return sentence_count >= 2 and word_count >= 25


def _looks_like_short_article_text(text: str) -> bool:
    normalized = _normalize_extracted_text(text)
    if len(normalized) < 60:
        return False

    sentence_count = len(re.findall(r"[.!?](?:\s|$)", normalized))
    word_count = len(normalized.split())
    return sentence_count >= 2 and word_count >= 10


def _select_best_extracted_result(candidates: list[ArticleParseResult]) -> ArticleParseResult:
    normalized_candidates = [
        ArticleParseResult(
            text=_normalize_extracted_text(candidate.text),
            source=candidate.source,
        )
        for candidate in candidates
        if _normalize_extracted_text(candidate.text)
    ]
    if not normalized_candidates:
        return ArticleParseResult(text="", source=None)

    article_like_candidates = [
        candidate for candidate in normalized_candidates if _looks_like_article_text(candidate.text)
    ]
    if article_like_candidates:
        return max(article_like_candidates, key=lambda item: _text_quality_score(item.text))

    short_article_candidates = [
        candidate
        for candidate in normalized_candidates
        if _looks_like_short_article_text(candidate.text)
    ]
    if short_article_candidates:
        generic_json_candidates = [
            candidate
            for candidate in short_article_candidates
            if candidate.source == ArticleTextSource.GENERIC_JSON
        ]
        ranked_candidates = generic_json_candidates or short_article_candidates
        return max(ranked_candidates, key=lambda item: _text_quality_score(item.text))

    return max(normalized_candidates, key=lambda item: _text_quality_score(item.text))


def _text_quality_score(text: str) -> tuple[int, int, int]:
    normalized = _normalize_extracted_text(text)
    sentence_count = len(re.findall(r"[.!?](?:\s|$)", normalized))
    word_count = len(normalized.split())
    return (sentence_count, word_count, len(normalized))
