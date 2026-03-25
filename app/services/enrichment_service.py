import asyncio
from time import monotonic

from fastapi import HTTPException

from app.core import get_settings
from app.repositories import EnrichmentRepository, create_repository
from app.schemas.enrichment import (
    ArticleEnrichmentRequest,
    ArticleEnrichmentResponse,
    DirectTextEnrichmentRequest,
    EnrichmentStatus,
    ErrorDetail,
    FlexibleTextEnrichmentRequest,
    InternalStageStatus,
    MixedConflictPayload,
    SentimentLabel,
    SentimentResult,
    StageName,
    StageStatus,
    SummaryLine,
    XAIHighlightItem,
    XAIPayload,
)
from app.schemas.mixed import ArticleMixedDetectionResult
from app.schemas.ingestion import EnrichmentJobStatus
from app.schemas.storage import AnalysisOutcome, AnalysisStatus, EnrichmentStoragePayload
from app.schemas.xai import XAIContributionDirection, XAIResult
from app.services.orchestrator import EnrichmentOrchestrator

settings = get_settings()


class EnrichmentService:
    def __init__(
        self,
        repository: EnrichmentRepository | None = None,
    ) -> None:
        self._repository = repository
        self._orchestrator: EnrichmentOrchestrator | None = (
            EnrichmentOrchestrator(repository=repository) if repository is not None else None
        )

    @property
    def repository(self) -> EnrichmentRepository:
        if self._repository is None:
            self._repository = create_repository()
        return self._repository

    @property
    def orchestrator(self) -> EnrichmentOrchestrator:
        if self._orchestrator is None:
            self._orchestrator = EnrichmentOrchestrator(repository=self.repository)
        return self._orchestrator

    async def enrich_article(
        self,
        payload: FlexibleTextEnrichmentRequest,
    ) -> ArticleEnrichmentResponse:
        if settings.use_worker_backed_direct_enrichment:
            storage_payload = await self._enqueue_and_wait_for_enrichment(payload)
            return build_api_enrichment_response(storage_payload)
        if payload.has_direct_text:
            storage_payload = await asyncio.to_thread(
                self.orchestrator.run_with_text,
                payload,
                article_text=payload.article_text,
                summary_text=payload.summary_text,
            )
        else:
            storage_payload = await asyncio.to_thread(self.orchestrator.run, payload)
        return build_api_enrichment_response(storage_payload)

    async def enrich_article_text(
        self,
        payload: DirectTextEnrichmentRequest,
    ) -> ArticleEnrichmentResponse:
        if settings.use_worker_backed_direct_enrichment:
            storage_payload = await self._enqueue_and_wait_for_enrichment(payload)
            return build_api_enrichment_response(storage_payload)
        storage_payload = await asyncio.to_thread(
            self.orchestrator.run_with_text,
            payload,
            article_text=payload.article_text,
            summary_text=payload.summary_text,
        )
        return build_api_enrichment_response(storage_payload)

    async def _enqueue_and_wait_for_enrichment(
        self,
        payload: FlexibleTextEnrichmentRequest,
    ) -> EnrichmentStoragePayload:
        await asyncio.to_thread(self.repository.upsert_raw_news, payload)

        active_job = await asyncio.to_thread(self.repository.get_active_job, payload.news_id)
        if active_job is not None:
            awaited_job_id = active_job.job_id
        else:
            created_job = await asyncio.to_thread(
                self.repository.create_enrichment_job,
                payload.news_id,
            )
            awaited_job_id = created_job.job_id

        deadline = monotonic() + settings.direct_enrichment_wait_timeout_seconds
        while monotonic() < deadline:
            _, latest_job, enrichment = await asyncio.to_thread(
                self.repository.get_news_snapshot,
                payload.news_id,
            )

            if latest_job is None or latest_job.job_id != awaited_job_id:
                await asyncio.sleep(settings.direct_enrichment_poll_interval_seconds)
                continue

            if latest_job.status in {
                EnrichmentJobStatus.COMPLETED,
                EnrichmentJobStatus.FAILED,
            }:
                if enrichment is not None:
                    return enrichment
                raise HTTPException(
                    status_code=500,
                    detail=latest_job.last_error
                    or "Worker finished the enrichment job without a stored result.",
                )

            await asyncio.sleep(settings.direct_enrichment_poll_interval_seconds)

        raise HTTPException(
            status_code=503,
            detail=(
                "Timed out waiting for the worker to complete the direct enrichment request. "
                "The job is still queued or processing."
            ),
        )


def build_api_enrichment_response(
    payload: EnrichmentStoragePayload,
) -> ArticleEnrichmentResponse:
    mixed_result = payload.article_mixed
    api_sentiment = _build_sentiment_payload(payload, mixed_result)

    return ArticleEnrichmentResponse(
        news_id=payload.news_id,
        title=payload.title,
        link=payload.link,
        summary_3lines=[
            SummaryLine(line_number=index, text=text)
            for index, text in enumerate(payload.summary_3lines, start=1)
        ],
        sentiment=api_sentiment,
        xai=_build_xai_payload(payload.xai, api_sentiment),
        mixed_flags=_build_mixed_flags(mixed_result),
        status=_map_overall_status(payload.analysis_status, payload.analysis_outcome),
        outcome=payload.analysis_outcome.value,
        analyzed_at=payload.analyzed_at,
        error=_build_error_detail(payload),
        stage_statuses=[_map_stage_status(stage) for stage in payload.stage_statuses],
    )


def _build_sentiment_payload(
    payload: EnrichmentStoragePayload,
    mixed_result: ArticleMixedDetectionResult | None,
) -> SentimentResult | None:
    if payload.sentiment is None:
        return None

    label = _map_sentiment_label(
        payload.sentiment.label,
        is_mixed=bool(mixed_result and mixed_result.is_mixed),
    )
    normalized_score = max(-1.0, min(1.0, round(payload.sentiment.score / 100.0, 4)))

    return SentimentResult(
        label=label,
        score=normalized_score,
        confidence=payload.sentiment.confidence,
    )


def _build_xai_payload(
    payload: XAIResult | None,
    sentiment: SentimentResult | None,
) -> XAIPayload | None:
    if payload is None:
        return None

    target_label = sentiment.label if sentiment is not None else None
    explanation = "Top article snippets influencing the sentiment result."
    if target_label is not None:
        explanation = (
            f"Top article snippets influencing the {target_label.value} sentiment result."
        )

    return XAIPayload(
        explanation=explanation,
        highlights=[
            XAIHighlightItem(
                excerpt=highlight.text_snippet,
                relevance_score=min(1.0, max(0.0, highlight.importance_score)),
                explanation=None,
                sentiment_signal=_map_highlight_signal(
                    highlight.contribution_direction,
                    target_label,
                ),
                start_char=highlight.start_char,
                end_char=highlight.end_char,
            )
            for highlight in payload.highlights
        ],
    )


def _build_mixed_flags(
    payload: ArticleMixedDetectionResult | None,
) -> MixedConflictPayload | None:
    if payload is None:
        return None

    return MixedConflictPayload(
        is_mixed=payload.is_mixed,
        has_conflicting_signals=payload.has_conflicting_signals,
        dominant_sentiment=_map_sentiment_label(
            payload.dominant_sentiment.value if payload.dominant_sentiment is not None else None,
            is_mixed=payload.is_mixed,
        ),
        conflict_reasons=[reason.message for reason in payload.reasons if reason.triggered],
    )


def _build_error_detail(
    payload: EnrichmentStoragePayload,
) -> ErrorDetail | None:
    if not payload.errors:
        return None

    first_error = payload.errors[0]
    retryable = False
    if payload.fetch_result is not None and payload.analysis_status == AnalysisStatus.FETCH_FAILED:
        retryable = payload.fetch_result.retryable

    return ErrorDetail(
        code=payload.analysis_status.value,
        message=first_error.message,
        retryable=retryable,
        details={
            "stage": first_error.stage.value,
            "analysis_outcome": payload.analysis_outcome.value,
        },
    )


def _map_stage_status(stage: object) -> InternalStageStatus:
    stage_name_map = {
        "fetch": StageName.FETCH,
        "clean": StageName.CLEAN,
        "validate": StageName.VALIDATE,
        "summarize": StageName.SUMMARY_GENERATION,
        "sentiment": StageName.SENTIMENT_ANALYSIS,
        "xai": StageName.XAI_EXTRACTION,
        "mixed_detection": StageName.MIXED_SIGNAL_DETECTION,
        "build_payload": StageName.BUILD_PAYLOAD,
        "persist": StageName.PERSIST,
    }
    stage_status_map = {
        "pending": StageStatus.NOT_STARTED,
        "completed": StageStatus.COMPLETED,
        "failed": StageStatus.FAILED,
        "skipped": StageStatus.SKIPPED,
    }

    stage_value = getattr(stage, "stage").value
    status_value = getattr(stage, "status").value

    return InternalStageStatus(
        stage=stage_name_map[stage_value],
        status=stage_status_map[status_value],
        started_at=getattr(stage, "started_at"),
        completed_at=getattr(stage, "completed_at"),
        error=None,
    )


def _map_overall_status(
    analysis_status: AnalysisStatus,
    analysis_outcome: AnalysisOutcome,
) -> EnrichmentStatus:
    if analysis_status == AnalysisStatus.PENDING:
        return EnrichmentStatus.PENDING
    if analysis_outcome == AnalysisOutcome.SUCCESS:
        return EnrichmentStatus.COMPLETED
    if analysis_outcome == AnalysisOutcome.PARTIAL_SUCCESS:
        return EnrichmentStatus.PARTIAL
    return EnrichmentStatus.FAILED


def _map_sentiment_label(
    label: str | None,
    *,
    is_mixed: bool,
) -> SentimentLabel | None:
    if label is None:
        return None
    if is_mixed:
        return SentimentLabel.MIXED
    label_map = {
        "positive": SentimentLabel.BULLISH,
        "negative": SentimentLabel.BEARISH,
        "neutral": SentimentLabel.NEUTRAL,
    }
    return label_map.get(label, SentimentLabel.NEUTRAL)


def _map_highlight_signal(
    direction: XAIContributionDirection,
    target_label: SentimentLabel | None,
) -> SentimentLabel | None:
    if target_label is None:
        return None
    if direction == XAIContributionDirection.POSITIVE:
        return target_label
    opposite_map = {
        SentimentLabel.BULLISH: SentimentLabel.BEARISH,
        SentimentLabel.BEARISH: SentimentLabel.BULLISH,
        SentimentLabel.NEUTRAL: SentimentLabel.NEUTRAL,
        SentimentLabel.MIXED: SentimentLabel.MIXED,
    }
    return opposite_map[target_label]
