from __future__ import annotations

import threading
from typing import Final

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

from app.schemas.sentiment import (
    AggregationStrategy,
    FinBERTSentimentLabel,
    SentimentChunkSource,
    SentimentProbabilities,
    SentimentResult,
)
from app.services.sentiment.chunking import (
    aggregate_chunk_results,
    build_chunk_sentiment_result,
    chunk_article_text,
)
from app.services.text_cleaner import clean_article_text


MODEL_NAME: Final[str] = "ProsusAI/finbert"
MAX_TOKENS_PER_CHUNK: Final[int] = 448
OVERLAP_SENTENCES: Final[int] = 1
DEFAULT_MAX_CHUNKS: Final[int] = 8
TITLE_WEIGHT: Final[float] = 1.25

_MODEL_LOCK = threading.Lock()
_TOKENIZER = None
_MODEL = None


def analyze_sentiment(
    title: str,
    article_text: str,
    *,
    max_chunk_tokens: int = MAX_TOKENS_PER_CHUNK,
    aggregation_strategy: AggregationStrategy = AggregationStrategy.WEIGHTED_MEAN,
) -> SentimentResult:
    """Run FinBERT sentiment analysis on title-aware article text."""
    cleaned_text = clean_article_text(article_text)
    if not cleaned_text:
        return SentimentResult(
            label=FinBERTSentimentLabel.NEUTRAL,
            score=0.0,
            confidence=1.0,
            probabilities=SentimentProbabilities(
                positive=0.0,
                neutral=1.0,
                negative=0.0,
            ),
            aggregation_strategy=aggregation_strategy,
            chunk_results=[],
            disagreement_ratio=0.0,
            chunk_count=0,
        )

    tokenizer, model = _get_finbert_components()
    chunk_results = _predict_chunks(
        title=title,
        article_text=cleaned_text,
        tokenizer=tokenizer,
        model=model,
        max_chunk_tokens=max_chunk_tokens,
    )
    return aggregate_chunk_results(
        chunk_results,
        strategy=aggregation_strategy,
    )


def predict_text_probabilities(texts: list[str]) -> list[SentimentProbabilities]:
    """Return FinBERT class probabilities for a batch of text inputs."""
    if not texts:
        return []

    tokenizer, model = _get_finbert_components()
    return [
        _score_text(
            text=text,
            tokenizer=tokenizer,
            model=model,
        )
        for text in texts
    ]


def _get_finbert_components():
    global _TOKENIZER, _MODEL
    if _TOKENIZER is not None and _MODEL is not None:
        return _TOKENIZER, _MODEL

    with _MODEL_LOCK:
        if _TOKENIZER is None:
            _TOKENIZER = AutoTokenizer.from_pretrained(MODEL_NAME)
        if _MODEL is None:
            _MODEL = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
            _MODEL.eval()
        return _TOKENIZER, _MODEL


def _predict_chunks(
    title: str,
    article_text: str,
    tokenizer,
    model,
    *,
    max_chunk_tokens: int,
) -> list:
    title_text = title.strip()
    body_chunks = chunk_article_text(
        article_text,
        token_count_fn=lambda text: _count_tokens(text=text, tokenizer=tokenizer),
        max_tokens=max_chunk_tokens,
        overlap_sentences=OVERLAP_SENTENCES,
        max_chunks=DEFAULT_MAX_CHUNKS,
    )
    chunk_results = []

    if title_text:
        title_probabilities = _score_text(
            text=title_text,
            tokenizer=tokenizer,
            model=model,
        )
        chunk_results.append(
            build_chunk_sentiment_result(
                chunk_index=0,
                source=SentimentChunkSource.TITLE,
                text=title_text,
                token_count=_count_tokens(text=title_text, tokenizer=tokenizer),
                weight=TITLE_WEIGHT,
                probabilities=title_probabilities,
            )
        )

    start_index = len(chunk_results)
    for offset, chunk in enumerate(body_chunks):
        probabilities = _score_text(
            text=chunk.text,
            tokenizer=tokenizer,
            model=model,
        )
        chunk_results.append(
            build_chunk_sentiment_result(
                chunk_index=start_index + offset,
                source=chunk.source,
                text=chunk.text,
                token_count=chunk.token_count,
                weight=chunk.weight,
                probabilities=probabilities,
            )
        )

    return chunk_results


def _score_text(text: str, tokenizer, model) -> SentimentProbabilities:
    encoded = tokenizer(
        text,
        truncation=True,
        max_length=512,
        return_tensors="pt",
    )

    with torch.no_grad():
        logits = model(**encoded).logits[0]
        probabilities = torch.softmax(logits, dim=0).tolist()

    # FinBERT label order for ProsusAI/finbert is positive, negative, neutral.
    return SentimentProbabilities(
        positive=float(probabilities[0]),
        negative=float(probabilities[1]),
        neutral=float(probabilities[2]),
    )


def _count_tokens(text: str, tokenizer) -> int:
    encoded = tokenizer(
        text,
        add_special_tokens=False,
        return_attention_mask=False,
        return_token_type_ids=False,
    )
    return len(encoded["input_ids"])
