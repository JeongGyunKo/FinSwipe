from __future__ import annotations

from app.services.groq.client import _build_chat_completions_url


def test_build_chat_completions_url_appends_v1_when_missing() -> None:
    assert (
        _build_chat_completions_url("https://api.groq.com/openai")
        == "https://api.groq.com/openai/v1/chat/completions"
    )


def test_build_chat_completions_url_avoids_double_v1() -> None:
    assert (
        _build_chat_completions_url("https://api.groq.com/openai/v1")
        == "https://api.groq.com/openai/v1/chat/completions"
    )
