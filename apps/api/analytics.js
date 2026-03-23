(function() {
    'use strict';

    const config = window.analyticsConfig || {};
    const site_id = config.projectId || ''; 
    const apiUrl = config.apiUrl || 'http://localhost/apanalytics/apps/api/collect.php';

    if (!site_id) {
        console.warn('[APAnalytics] Missing site_id / projectId in config.');
        return;
    }

    const track = (eventName = 'page_view') => {
        const urlParams = new URLSearchParams(window.location.search);
        const data = {
            site_id: site_id,
            event: eventName,
            path: window.location.pathname,
            referrer: document.referrer,
            screen_width: window.screen.width,
            language: navigator.language,
            utm_source: urlParams.get('utm_source') || '',
            utm_medium: urlParams.get('utm_medium') || '',
            utm_campaign: urlParams.get('utm_campaign') || ''
        };

        const params = new URLSearchParams(data).toString();
        fetch(`${apiUrl}?${params}`, { mode: 'no-cors', cache: 'no-cache' })
            .catch(err => console.error('[APAnalytics] Tracking failed:', err));
    };

    // Expose global track function so users can manually fire events
    window.apTrackEvent = function(eventName) {
        if (eventName) track(eventName);
    };

    // Track initial page view
    track();

    // Track SPA navigation
    let lastPath = window.location.pathname;
    const observer = new MutationObserver(() => {
        if (window.location.pathname !== lastPath) {
            lastPath = window.location.pathname;
            track();
        }
    });
    observer.observe(document.querySelector('body'), { childList: true, subtree: true });

    // Auto-track button and link clicks
    document.addEventListener('click', (e) => {
        let el = e.target.closest('button, a, [data-event]');
        if (el) {
            let evName = el.getAttribute('data-event');
            if (!evName) {
                // If it's a button, use its text or id
                if (el.tagName.toLowerCase() === 'button') {
                    evName = el.id || el.innerText.trim().substring(0, 20).toLowerCase().replace(/\s+/g, '_') || 'button_click';
                } else if (el.tagName.toLowerCase() === 'a') {
                    evName = el.id || 'link_click';
                }
            }
            if (evName) track(evName);
        }
    });

    if (config.debug) {
        console.log('[APAnalytics] Tracking initialized for:', site_id);
    }
})();
