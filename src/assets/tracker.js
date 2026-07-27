(function () {
    const scriptTag = document.currentScript;

    const website_id = scriptTag?.getAttribute('data-website-id');
    const api_endpoint = scriptTag?.getAttribute('data-api');

    if (!website_id || !api_endpoint) return;

    const SESSION_KEY = "trackflow_session_id";

    function getSessionId() {
        let id = sessionStorage.getItem(SESSION_KEY);

        if (!id) {
            id = crypto.randomUUID();
            sessionStorage.setItem(SESSION_KEY, id);
        }

        return id;
    }

    function basePayload() {
        const currentReferrer = document.referrer;
        let cleanReferrer = null;

        // Only record the referrer if it exists and DOES NOT include your own domain name
        if (currentReferrer && !currentReferrer.includes(window.location.hostname)) {
            cleanReferrer = currentReferrer;
        }

        return {
            website_id,
            tf_session_id: getSessionId(),
            params: Object.fromEntries(new URLSearchParams(window.location.search)),
            url: window.location.href,
            referrer: cleanReferrer, // Keeps internal navigation from polluting your charts
            page_title: document.title,
            screen: {
                width: window.screen.width,
                height: window.screen.height,
            },
            lang: navigator.language,
        };
    }

    async function sendEvent(
        event_type,
        value = null,
        currency = null
    ) {
        const payload = {
            ...basePayload(),
            event: {
                type: event_type,
                value,
                currency,
            },
        };

        try {
            await fetch(api_endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
                keepalive: true,
            });
        } catch (err) {
            console.error("TrackFlow error:", err);
        }
    }

    // Auto page view
    sendEvent("page_view");

    // Attach to window (global SDK)
    (window).trackflow = {
        track: sendEvent,
    };
})();