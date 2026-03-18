from __future__ import annotations

from datetime import datetime, timezone

from pydantic import Field

from app.schemas.enrichment import SchemaModel


class CountMetric(SchemaModel):
    key: str = Field(..., min_length=1)
    count: int = Field(..., ge=0)


class PublisherFetchFailureMetric(SchemaModel):
    publisher_domain: str = Field(..., min_length=1)
    failure_count: int = Field(..., ge=0)
    retryable_failure_count: int = Field(..., ge=0)


class PublisherOutcomeMetric(SchemaModel):
    publisher_domain: str = Field(..., min_length=1)
    total_count: int = Field(..., ge=0)
    success_count: int = Field(..., ge=0)
    partial_success_count: int = Field(..., ge=0)
    fatal_failure_count: int = Field(..., ge=0)


class OperationalStatsResponse(SchemaModel):
    generated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="When the operational snapshot was generated.",
    )
    total_enrichment_results: int = Field(..., ge=0)
    total_jobs: int = Field(..., ge=0)
    total_fetch_failures: int = Field(..., ge=0)
    retryable_fetch_failures: int = Field(..., ge=0)
    job_status_counts: list[CountMetric] = Field(default_factory=list)
    analysis_status_counts: list[CountMetric] = Field(default_factory=list)
    extraction_source_counts: list[CountMetric] = Field(default_factory=list)
    fetch_failure_category_counts: list[CountMetric] = Field(default_factory=list)
    top_failure_domains: list[PublisherFetchFailureMetric] = Field(default_factory=list)
    publisher_outcomes: list[PublisherOutcomeMetric] = Field(default_factory=list)
