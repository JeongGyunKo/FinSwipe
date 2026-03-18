from __future__ import annotations

from app.services.text_cleaner import (
    ArticleTextValidationStatus,
    clean_article_text,
    validate_article_text,
)


def test_clean_article_text_removes_safe_boilerplate_and_normalizes_whitespace() -> None:
    raw_text = """
    Advertisement

    Revenue   rose  12% year over year.

    Margins improved in the quarter.

    https://example.com/read-more
    """

    cleaned = clean_article_text(raw_text)

    assert "Advertisement" not in cleaned
    assert "https://example.com/read-more" not in cleaned
    assert cleaned == "Revenue rose 12% year over year.\nMargins improved in the quarter."


def test_validate_article_text_flags_short_content() -> None:
    result = validate_article_text("Revenue rose slightly.")

    assert result.is_valid is False
    assert result.status == ArticleTextValidationStatus.TOO_SHORT
    assert result.reason is not None
