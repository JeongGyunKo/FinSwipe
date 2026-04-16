from __future__ import annotations

from app.services.text_cleaner import clean_article_text, validate_article_text


def test_validate_article_text_allows_ten_character_input() -> None:
    validation = validate_article_text("1234567890")

    assert validation.is_valid is True
    assert validation.status.value == "valid"


def test_clean_article_text_removes_common_financial_table_headers() -> None:
    raw_text = (
        "CONDENSED CONSOLIDATED STATEMENTS OF INCOME\n"
        "(In millions, except per share data)\n"
        "(Unaudited)\n"
        "Revenue rose 12% year over year.\n"
        "Management raised guidance.\n"
    )

    cleaned = clean_article_text(raw_text)

    assert "CONDENSED CONSOLIDATED" not in cleaned
    assert "In millions" not in cleaned
    assert "Unaudited" not in cleaned
    assert "Revenue rose 12% year over year." in cleaned
