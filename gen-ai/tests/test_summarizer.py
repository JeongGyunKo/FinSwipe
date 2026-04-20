from __future__ import annotations

from app.services.summarizer import summarize_to_three_lines


def test_summarizer_returns_exactly_three_non_empty_lines() -> None:
    article_text = (
        "The company reported quarterly revenue of $12.4 billion, up 8% from a year earlier. "
        "Management said cloud demand remained strong and raised its full-year outlook. "
        "Operating margin narrowed as the company increased AI infrastructure spending. "
        "Shares rose in after-hours trading after the results were released."
    )

    summary = summarize_to_three_lines(
        title="Company raises outlook after quarterly results",
        article_text=article_text,
    )

    assert len(summary) == 3
    assert all(isinstance(line, str) for line in summary)
    assert all(line.strip() for line in summary)


def test_summarizer_keeps_common_abbreviations_inside_sentence() -> None:
    article_text = (
        "Oil prices resumed their rise because of the war with Iran, but U.S. stocks held steadier this time around. "
        "The S&P 500 rose 0.2% Tuesday and added to its gain from the day before, which was its biggest since the war began. "
        "The Dow Jones Industrial Average climbed 0.1%, and the Nasdaq composite gained 0.5%."
    )

    summary = summarize_to_three_lines(
        title="Oil prices rise while U.S. stocks stay steadier",
        article_text=article_text,
    )

    assert any("U.S. stocks held steadier this time around." in line for line in summary)
    assert all(not line.startswith("stocks held steadier") for line in summary)
