from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from functools import lru_cache

from app.core import get_settings
from app.schemas.enrichment import (
    LocalizedArticleContent,
    SentimentLabel,
    SummaryLine,
    XAIHighlightItem,
    XAIPayload,
)
from app.services.groq import groq_chat_completion, groq_is_enabled

logger = logging.getLogger(__name__)

_FINANCE_TOKEN_PATTERN = re.compile(
    r"\b(?:EPS|YoY|QoQ|P/E|EBITDA|ROI|ROE|CAGR|FCF|AI|IPO)\b"
)
_NUMBER_PATTERN = re.compile(
    r"(?<![A-Za-z])(?:[$€£¥]?\d[\d,]*(?:\.\d+)?%?|\d+(?:\.\d+)?x)(?![A-Za-z])"
)

_SENTIMENT_LABELS_KO = {
    SentimentLabel.BULLISH: "강세",
    SentimentLabel.BEARISH: "약세",
    SentimentLabel.NEUTRAL: "중립",
    SentimentLabel.MIXED: "혼합",
}

_TICKER_BOX_LABELS_KO = {
    "revenue": "매출",
    "net_income": "순이익",
    "operating_income": "영업이익",
    "guidance": "가이던스",
    "target_price": "목표주가",
    "dividend": "배당",
    "eps": "EPS",
    "yoy": "YoY",
    "qoq": "QoQ",
    "market_cap": "시가총액",
    "pe_ratio": "PER",
}


@dataclass(frozen=True, slots=True)
class _MaskedText:
    text: str
    replacements: dict[str, str]


def build_localized_content(
    *,
    title: str,
    summary_3lines: list[SummaryLine],
    xai: XAIPayload | None,
    sentiment_label: SentimentLabel | None,
    tickers: list[str] | None = None,
) -> LocalizedArticleContent:
    translated_title = _translate_with_fallback(title, tickers=tickers, request_label="translate_title")
    translated_summary = [
        SummaryLine(
            line_number=line.line_number,
            text=_translate_with_fallback(
                line.text,
                tickers=tickers,
                request_label=f"translate_summary_line_{line.line_number}",
            ),
        )
        for line in summary_3lines
    ]
    translated_xai = _translate_xai_payload(xai, tickers=tickers)

    return LocalizedArticleContent(
        language="ko",
        title=translated_title,
        summary_3lines=translated_summary,
        xai=translated_xai,
        sentiment_label=_SENTIMENT_LABELS_KO.get(sentiment_label),
        ticker_box_labels=dict(_TICKER_BOX_LABELS_KO),
    )


def _translate_xai_payload(
    payload: XAIPayload | None,
    *,
    tickers: list[str] | None,
) -> XAIPayload | None:
    if payload is None:
        return None

    return XAIPayload(
        explanation=_translate_with_fallback(
            payload.explanation,
            tickers=tickers,
            request_label="translate_xai_explanation",
        ),
        highlights=[
            XAIHighlightItem(
                excerpt=_translate_with_fallback(
                    item.excerpt,
                    tickers=tickers,
                    request_label=f"translate_xai_highlight_{index + 1}",
                ),
                relevance_score=item.relevance_score,
                explanation=(
                    _translate_with_fallback(
                        item.explanation,
                        tickers=tickers,
                        request_label=f"translate_xai_detail_{index + 1}",
                    )
                    if item.explanation
                    else None
                ),
                sentiment_signal=item.sentiment_signal,
                start_char=item.start_char,
                end_char=item.end_char,
            )
            for index, item in enumerate(payload.highlights)
        ],
    )


def _translate_with_fallback(
    text: str,
    *,
    tickers: list[str] | None,
    request_label: str,
) -> str:
    normalized = text.strip()
    if not normalized:
        return normalized

    if not groq_is_enabled():
        return normalized

    try:
        return _translate_text(normalized, tickers=tickers, request_label=request_label)
    except Exception:
        logger.exception("Groq translation failed; falling back to source text.")
        return normalized


def _translate_text(text: str, *, tickers: list[str] | None, request_label: str) -> str:
    settings = get_settings()
    prepared = _prepare_translation_input(text, char_limit=settings.groq_translation_char_limit)
    masked = _mask_text(prepared, tickers=tickers)
    translated = _cached_translation_completion(
        settings.groq_api_base_url,
        settings.groq_translation_model,
        masked.text,
        request_label,
    )
    return _polish_korean_financial_text(_unmask_text(translated, masked.replacements))


def _mask_text(text: str, *, tickers: list[str] | None) -> _MaskedText:
    replacements: dict[str, str] = {}
    masked = text
    protected_tokens = sorted(
        {
            *(ticker.strip() for ticker in (tickers or []) if ticker and ticker.strip()),
            *(_FINANCE_TOKEN_PATTERN.findall(text)),
            *(_NUMBER_PATTERN.findall(text)),
        },
        key=len,
        reverse=True,
    )

    for index, token in enumerate(protected_tokens):
        placeholder = f"ZXQKEEP{index}ZXQ"
        replacements[placeholder] = token
        masked = masked.replace(token, placeholder)

    return _MaskedText(text=masked, replacements=replacements)


def _unmask_text(text: str, replacements: dict[str, str]) -> str:
    unmasked = text
    for placeholder, token in replacements.items():
        unmasked = unmasked.replace(placeholder, token)
    return unmasked


@lru_cache(maxsize=512)
def _cached_translation_completion(base_url: str, model: str, masked_text: str, request_label: str) -> str:
    del base_url
    return groq_chat_completion(
        model=model,
        system_prompt=(
            "You are a Korean financial news translator. "
            "Translate the input into natural Korean financial news style. "
            "Use concise declarative 기사체 and avoid literal translation. "
            "Prefer established financial terminology such as '가이던스', '전년 대비', and '경영진' when appropriate. "
            "Keep placeholders unchanged. "
            "Keep numbers, percentages, dates, currencies, ticker symbols, and finance abbreviations exactly as written. "
            "Do not add commentary, quotation marks, bullets, or explanations."
        ),
        user_prompt=masked_text,
        temperature=0.0,
        request_label=request_label,
    )


def _prepare_translation_input(text: str, *, char_limit: int) -> str:
    normalized = re.sub(r"\s+", " ", text).strip()
    if len(normalized) <= char_limit:
        return normalized

    truncated = normalized[:char_limit].rsplit(" ", 1)[0].rstrip(",;:-")
    return truncated or normalized[:char_limit]


def _polish_korean_financial_text(text: str) -> str:
    polished = text.strip()
    replacements = (
        ("매니저들", "경영진"),
        ("매니저들은", "경영진은"),
        ("매니저는", "경영진은"),
        ("관리진", "경영진"),
        ("전망을 높였다고", "가이던스를 상향했다고"),
        ("했다고 합니다.", "했다고 밝혔다."),
        ("라고 합니다.", "라고 밝혔다."),
        ("라고 말했다.", "라고 밝혔다."),
        ("말했습니다.", "밝혔다."),
        ("말했다.", "밝혔다."),
        ("전망을 높였다", "가이던스를 상향했다"),
        ("강력하게 유지", "견조했다"),
        ("향상되었다고 합니다.", "개선됐다."),
        ("향상되었다.", "개선됐다."),
    )
    for source, target in replacements:
        polished = polished.replace(source, target)
    return polished
