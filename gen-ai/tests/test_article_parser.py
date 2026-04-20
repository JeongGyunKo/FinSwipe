from __future__ import annotations

from app.schemas.article_fetch import ArticleTextSource
from app.services.article_fetcher.parser import SimpleHTMLArticleParser


def test_parser_prefers_json_ld_article_body_when_present() -> None:
    html = """
    <html>
      <head>
        <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": "Revenue rises",
            "articleBody": "Revenue rose 12% year over year. Operating margin improved in the quarter. Management raised full-year guidance."
          }
        </script>
      </head>
      <body>
        <div>Subscribe now</div>
      </body>
    </html>
    """

    parsed = SimpleHTMLArticleParser().extract_text(html)

    assert "Revenue rose 12% year over year." in parsed
    assert "Management raised full-year guidance." in parsed
    assert "Subscribe now" not in parsed
    assert SimpleHTMLArticleParser().extract_result(html).source == ArticleTextSource.JSON_LD


def test_parser_collects_multiple_article_paragraphs_in_order() -> None:
    html = """
    <html>
      <body>
        <article class="article-body">
          <p>Shares climbed after the company reported stronger quarterly revenue.</p>
          <p>Executives said demand from enterprise customers remained healthy.</p>
          <p>Management also reaffirmed its margin outlook for the rest of the year.</p>
        </article>
      </body>
    </html>
    """

    parsed = SimpleHTMLArticleParser().extract_text(html)

    assert "Shares climbed after the company reported stronger quarterly revenue." in parsed
    assert "Executives said demand from enterprise customers remained healthy." in parsed
    assert "Management also reaffirmed its margin outlook for the rest of the year." in parsed


def test_parser_falls_back_to_meta_description_when_article_text_is_missing() -> None:
    html = """
    <html>
      <head>
        <meta property="og:description" content="Stocks moved higher after the central bank signaled a slower pace of tightening.">
      </head>
      <body>
        <div class="hero">Markets Today</div>
      </body>
    </html>
    """

    parsed = SimpleHTMLArticleParser().extract_text(html)

    assert parsed == (
        "Stocks moved higher after the central bank signaled a slower pace of tightening."
    )
    assert (
        SimpleHTMLArticleParser().extract_result(html).source
        == ArticleTextSource.META_DESCRIPTION
    )


def test_parser_prefers_longer_visible_article_text_over_short_structured_preview() -> None:
    html = """
    <html>
      <head>
        <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "description": "Oil prices rose while stocks held steadier."
          }
        </script>
        <meta property="og:description" content="Oil prices rose while stocks held steadier.">
      </head>
      <body>
        <article class="article-body">
          <p>Oil prices resumed their rise because of the war with Iran, but U.S. stocks held steadier this time around.</p>
          <p>The S&P 500 rose 0.2% Tuesday and added to its gain from the day before, which was its biggest since the war began.</p>
          <p>The Dow Jones Industrial Average climbed 0.1%, and the Nasdaq composite gained 0.5%.</p>
        </article>
      </body>
    </html>
    """

    parsed = SimpleHTMLArticleParser().extract_text(html)

    assert "Oil prices resumed their rise because of the war with Iran" in parsed
    assert "The S&P 500 rose 0.2% Tuesday" in parsed
    assert parsed != "Oil prices rose while stocks held steadier."


def test_parser_extracts_article_text_from_next_data_json() -> None:
    html = """
    <html>
      <head>
        <script id="__NEXT_DATA__" type="application/json">
          {
            "props": {
              "pageProps": {
                "article": {
                  "body": "Stocks moved higher after the Federal Reserve signaled patience. Treasury yields eased as investors reassessed the rate outlook.",
                  "summary": "Markets rallied on lower yields."
                }
              }
            }
          }
        </script>
      </head>
      <body>
        <div id="__next"></div>
      </body>
    </html>
    """

    parsed = SimpleHTMLArticleParser().extract_text(html)

    assert "Stocks moved higher after the Federal Reserve signaled patience." in parsed
    assert "Treasury yields eased as investors reassessed the rate outlook." in parsed
    assert SimpleHTMLArticleParser().extract_result(html).source == ArticleTextSource.GENERIC_JSON


def test_parser_extracts_joined_paragraphs_from_generic_json_script() -> None:
    html = """
    <html>
      <head>
        <script type="application/json">
          {
            "article": {
              "paragraphs": [
                {"text": "Revenue rose 12% year over year as enterprise demand improved."},
                {"text": "Management raised full-year guidance and said margins stabilized."},
                {"text": "Shares climbed in after-hours trading following the release."}
              ]
            }
          }
        </script>
      </head>
      <body></body>
    </html>
    """

    parsed = SimpleHTMLArticleParser().extract_text(html)

    assert "Revenue rose 12% year over year as enterprise demand improved." in parsed
    assert "Management raised full-year guidance and said margins stabilized." in parsed
    assert "Shares climbed in after-hours trading following the release." in parsed
