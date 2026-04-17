from __future__ import annotations

from app.services.text_cleaner import clean_article_text, validate_article_text


def test_validate_article_text_allows_ten_character_input() -> None:
    validation = validate_article_text(
        "Revenue rose 12% and management raised guidance for the year.",
        allow_brief=True,
    )

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


def test_clean_article_text_keeps_long_single_line_articles_with_financial_terms() -> None:
    raw_text = (
        "Microsoft posted a solid quarterly earnings and revenue beat, while non-GAAP earnings "
        "rose to $4.14 per share and GAAP remained part of the company discussion in the report. "
        "Revenue reached $81.27 billion and management said Azure growth was 39% year over year, "
        "with analysts continuing to debate whether the outlook remains strong."
    )

    cleaned = clean_article_text(raw_text)

    assert cleaned == raw_text


def test_clean_article_text_keeps_narrative_earnings_lines_with_gaap_terms() -> None:
    raw_text = (
        "WD-40 reported second-quarter results and said revenue rose 5% year over year. "
        "Management said non-GAAP gross margin improved while GAAP results reflected higher "
        "operating costs, and the company reaffirmed full-year guidance.\n"
        "(In millions, except per share data)\n"
        "CONDENSED CONSOLIDATED STATEMENTS OF INCOME\n"
    )

    cleaned = clean_article_text(raw_text)

    assert "WD-40 reported second-quarter results" in cleaned
    assert "non-GAAP gross margin improved while GAAP results reflected higher operating costs" in cleaned
    assert "In millions" not in cleaned
    assert "CONDENSED CONSOLIDATED" not in cleaned


def test_validate_article_text_requires_richer_article_bodies_by_default() -> None:
    validation = validate_article_text("Revenue rose and outlook improved.")

    assert validation.is_valid is False
    assert validation.status.value == "too_short"
