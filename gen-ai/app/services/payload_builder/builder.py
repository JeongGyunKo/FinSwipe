from __future__ import annotations

from datetime import datetime, timezone

from app.schemas.article_fetch import ArticleFetchResult
from app.schemas.mixed import (
    ArticleMixedDetectionResult,
    TickerMixedDetectionResult,
)
from app.schemas.sentiment import SentimentResult as FinBERTSentimentResult
from app.schemas.storage import (
    AnalysisOutcome,
    AnalysisStatus,
    EnrichmentStoragePayload,
    PipelineStageResult,
    StoragePayloadError,
    build_stored_sentiment_payload,
)
from app.schemas.xai import XAIResult


def build_enrichment_storage_payload(
    *,
    news_id: str,
    title: str,
    link: str,
    analysis_status: AnalysisStatus,
    analysis_outcome: AnalysisOutcome,
    stage_statuses: list[PipelineStageResult],
    fetch_result: ArticleFetchResult | None = None,
    cleaned_text: str | None = None,
    summary_3lines: list[str] | None = None,
    sentiment_result: FinBERTSentimentResult | None = None,
    xai_result: XAIResult | None = None,
    article_mixed: ArticleMixedDetectionResult | None = None,
    ticker_mixed: TickerMixedDetectionResult | None = None,
    analyzed_at: datetime | None = None,
    errors: list[StoragePayloadError] | None = None,
) -> EnrichmentStoragePayload:
    """Assemble a database-ready storage payload from enrichment stage outputs."""
    normalized_summary = _normalize_summary_lines(summary_3lines)

    return EnrichmentStoragePayload(
        news_id=news_id,
        title=title,
        link=link,
        summary_3lines=normalized_summary,
        sentiment=(
            build_stored_sentiment_payload(sentiment_result)
            if sentiment_result is not None
            else None
        ),
        xai=xai_result,
        article_mixed=article_mixed,
        ticker_mixed=ticker_mixed,
        analysis_status=analysis_status,
        analysis_outcome=analysis_outcome,
        analyzed_at=_normalize_timestamp(analyzed_at),
        cleaned_text_available=bool((cleaned_text or "").strip()),
        fetch_result=fetch_result,
        stage_statuses=stage_statuses,
        errors=list(errors or []),
    )


def _normalize_summary_lines(summary_3lines: list[str] | None) -> list[str]:
    if not summary_3lines:
        return []
    return [line.strip() for line in summary_3lines if line and line.strip()][:3]


def _normalize_timestamp(value: datetime | None) -> datetime:
    timestamp = value or datetime.now(timezone.utc)
    if timestamp.tzinfo is None:
        return timestamp.replace(tzinfo=timezone.utc)
    return timestamp.astimezone(timezone.utc)
