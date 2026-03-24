from fastapi import APIRouter

from app.db import get_database_backend, ping_database_backend


router = APIRouter(tags=["health"])


@router.get("/health", summary="Health check")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/health/deep", summary="Deep health check")
async def deep_health_check() -> dict[str, str | bool | None]:
    database_ok, database_error = ping_database_backend()
    return {
        "status": "ok" if database_ok else "degraded",
        "database_backend": get_database_backend(),
        "database_ok": database_ok,
        "database_error": database_error,
    }
