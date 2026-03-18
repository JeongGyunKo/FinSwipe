from fastapi import APIRouter

from app.schemas.enrichment import ArticleEnrichmentRequest, ArticleEnrichmentResponse
from app.services.enrichment_service import EnrichmentService


router = APIRouter(tags=["enrichment"])
service = EnrichmentService()


@router.post(
    "/articles/enrich",
    response_model=ArticleEnrichmentResponse,
    summary="Enrich a financial news article",
)
async def enrich_article(
    payload: ArticleEnrichmentRequest,
) -> ArticleEnrichmentResponse:
    return await service.enrich_article(payload)
