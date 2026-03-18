const form = document.getElementById("enrichment-form");
const submitButton = document.getElementById("submit-button");
const statusBanner = document.getElementById("status-banner");
const responseOutput = document.getElementById("response-output");
const analysisStatus = document.getElementById("analysis-status");
const analysisOutcome = document.getElementById("analysis-outcome");
const summaryCount = document.getElementById("summary-count");
const errorCount = document.getElementById("error-count");

function normalizeTickers(value) {
    return value
        .split(",")
        .map((ticker) => ticker.trim())
        .filter(Boolean);
}

function buildPayload(formData) {
    const payload = {
        news_id: formData.get("news_id"),
        title: formData.get("title"),
        link: formData.get("link"),
    };

    const tickers = normalizeTickers(formData.get("ticker") || "");
    const source = (formData.get("source") || "").trim();
    const publishedAt = formData.get("published_at");

    if (tickers.length > 0) {
        payload.ticker = tickers;
    }

    if (source) {
        payload.source = source;
    }

    if (publishedAt) {
        payload.published_at = new Date(publishedAt).toISOString();
    }

    return payload;
}

function setLoadingState(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? "Running..." : "Run Enrichment";
}

function renderResponse(data) {
    analysisStatus.textContent = data.analysis_status || "unknown";
    analysisOutcome.textContent = data.analysis_outcome || "unknown";
    summaryCount.textContent = String((data.summary_3lines || []).length);
    errorCount.textContent = String((data.errors || []).length);
    responseOutput.textContent = JSON.stringify(data, null, 2);
}

function renderError(message, details) {
    analysisStatus.textContent = "request_failed";
    analysisOutcome.textContent = "fatal_failure";
    summaryCount.textContent = "0";
    errorCount.textContent = "1";
    responseOutput.textContent = JSON.stringify(
        {
            message,
            details,
        },
        null,
        2,
    );
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = buildPayload(formData);

    setLoadingState(true);
    statusBanner.textContent = "Calling /api/v1/articles/enrich ...";

    try {
        const response = await fetch("/api/v1/articles/enrich", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            statusBanner.textContent = "Request failed. Inspect the response payload below.";
            renderError("API request failed", data);
            return;
        }

        statusBanner.textContent = "Enrichment request completed. Inspect the structured payload below.";
        renderResponse(data);
    } catch (error) {
        statusBanner.textContent = "The request could not reach the backend.";
        renderError("Network or server error", String(error));
    } finally {
        setLoadingState(false);
    }
});
