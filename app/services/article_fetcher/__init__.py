"""Article fetching package."""

from app.services.article_fetcher.fetcher import fetch_article_text
from app.services.article_fetcher.policy import FetchRetryPolicy

__all__ = ["FetchRetryPolicy", "fetch_article_text"]
