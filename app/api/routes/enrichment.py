from fastapi import APIRouter

from app.schemas.ingestion import (
    DirectTextIngestionRequest,
    IngestionAcceptedResponse,
    RawNewsIngestionRequest,
)
from app.services.ingestion_service import IngestionService


router = APIRouter(tags=["enrichment"])
service = IngestionService()


@router.post(
    "/articles/enrich",
    response_model=IngestionAcceptedResponse,
    status_code=202,
    summary="Submit a financial news article for enrichment",
)
async def enrich_article(
    payload: RawNewsIngestionRequest,
) -> IngestionAcceptedResponse:
    return await service.ingest_article(payload)


@router.post(
    "/articles/enrich-text",
    response_model=IngestionAcceptedResponse,
    status_code=202,
    summary="Submit licensed article or summary text for enrichment",
)
async def enrich_article_text(
    payload: DirectTextIngestionRequest,
) -> IngestionAcceptedResponse:
    return await service.ingest_article_text(payload)
