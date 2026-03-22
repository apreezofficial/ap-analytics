/**
 * Advanced Analytics Tracker v2.0
 * 
 * Version: 2.0.0
 * 
 * Features:
 * - API Key support for global multi-project access
 * - Project ID support for tracking multiple websites
 * - Time on page tracking
 * - Page performance metrics (load time, ttfb, FCP, LCP, etc.)
 * - Session management
 * - UTM first/last touch attribution
 * - Auto page view tracking
 * - SPA support
 * 
 * Usage:
 * <script>
 *   window.analyticsConfig = {
 *     apiUrl: 'https://api.preciousadedokun.com.ng/v1/analytics/track',
 *     apiKey: 'your_api_key_here',  // Optional - for global access
 *     projectId: 'my_project',       // Required - unique project identifier
 *     projectName: 'My Website',
 *     domain: 'example.com',
 *     debug: false
 *   };
 * </script>
 * <script src="https://api.preciousadedokun.com.ng/v1/analytics/analytics.js" async defer></script>
 */

(function () {
    'use strict';

    // Configuration
    var config = window.analyticsConfig || {};
    var API_URL = config.apiUrl || 'https://api.preciousadedokun.com.ng/v1/analytics/track.php';
    var API_KEY = config.apiKey || '';
    var PROJECT_ID = config.projectId || 'default';
    var PROJECT_NAME = config.projectName || '';
    var DOMAIN = config.domain || '';
    var DEBUG = config.debug || false;

    // Session management
    var SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    var sessionId = null;
    var sessionStartTime = null;
    var pageStartTime = null;
    var previousPage = null;
    var previousPageTime = 0;

    // Utility functions
    function log() {
        if (DEBUG && console && console.log) {
            console.log('[Analytics]', arguments);
        }
    }

    /**
     * Generate unique session ID
     */
    function generateSessionId() {
        return 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Get or create session
     */
    function getSession() {
        var storedSession = null;

        try {
            storedSession = sessionStorage.getItem('analytics_session');
        } catch (e) {
            log('sessionStorage not available');
        }

        if (storedSession) {
            try {
                var session = JSON.parse(storedSession);
                var now = Date.now();

                // Check if session is still valid
                if (now - session.startTime < SESSION_TIMEOUT) {
                    return session;
                }
            } catch (e) {
                log('Invalid session data');
            }
        }

        // Create new session
        var newSession = {
            id: generateSessionId(),
            startTime: Date.now(),
            pageCount: 0
        };

        try {
            sessionStorage.setItem('analytics_session', JSON.stringify(newSession));
        } catch (e) {
            log('sessionStorage not available');
        }

        return newSession;
    }

    /**
     * Update session
     */
    function updateSession() {
        var session = getSession();
        session.pageCount++;

        try {
            sessionStorage.setItem('analytics_session', JSON.stringify(session));
        } catch (e) {
            log('sessionStorage not available');
        }

        return session;
    }

    /**
     * Get UTM parameters from URL
     */
    function getUTMParams() {
        var utmParams = {};
        var searchParams = [
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_term',
            'utm_content', 'utm_id', 'utm_cid'
        ];

        searchParams.forEach(function (param) {
            var value = getQueryParam(param);
            if (value) {
                utmParams[param] = value;
            }
        });

        return utmParams;
    }

    /**
     * Get query parameter
     */
    function getQueryParam(param) {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    /**
     * Store UTM in localStorage for attribution
     */
    function storeUTM(utm) {
        if (!utm || Object.keys(utm).length === 0) return;

        try {
            var existingFirst = localStorage.getItem('analytics_first_utm');
            var existingLast = localStorage.getItem('analytics_last_utm');

            // Store first touch only if not exists
            if (!existingFirst) {
                localStorage.setItem('analytics_first_utm', JSON.stringify(utm));
            }
            // Always update last touch
            localStorage.setItem('analytics_last_utm', JSON.stringify(utm));
        } catch (e) {
            log('localStorage not available:', e);
        }
    }

    /**
     * Get stored UTM (last touch)
     */
    function getStoredUTM() {
        try {
            var lastUTM = localStorage.getItem('analytics_last_utm');
            if (lastUTM) {
                return JSON.parse(lastUTM);
            }
        } catch (e) {
            log('Error getting stored UTM:', e);
        }
        return null;
    }

    /**
     * Get first touch UTM
     */
    function getFirstTouchUTM() {
        try {
            var firstUTM = localStorage.getItem('analytics_first_utm');
            if (firstUTM) {
                return JSON.parse(firstUTM);
            }
        } catch (e) {
            log('Error getting first touch UTM:', e);
        }
        return null;
    }

    /**
     * Get page data
     */
    function getPageData(performanceData) {
        var now = Date.now();
        var timeOnPage = 0;

        if (pageStartTime && previousPage === window.location.pathname) {
            timeOnPage = (now - pageStartTime) / 1000; // Convert to seconds
        }

        // Update page tracking
        previousPage = window.location.pathname;
        pageStartTime = now;

        var session = getSession();

        var data = {
            project_id: PROJECT_ID,
            project_name: PROJECT_NAME,
            domain: DOMAIN,
            page: window.location.pathname,
            title: document.title || '',
            page_url: window.location.href,
            referrer: document.referrer || '',
            screen: window.screen.width + 'x' + window.screen.height,
            viewport: (window.innerWidth || 0) + 'x' + (window.innerHeight || 0),
            color_depth: window.screen.colorDepth || '',
            language: navigator.language || navigator.userLanguage || '',
            cookies: navigator.cookieEnabled,
            js: true,
            connection: getConnectionType(),

            // Session
            session_id: session.id,

            // Time tracking
            time_on_page: timeOnPage,

            // Performance metrics
            page_load_time: performanceData.loadTime,
            dom_ready_time: performanceData.domReady,
            ttfb: performanceData.ttfb,
            first_paint: performanceData.firstPaint,
            first_contentful_paint: performanceData.fcp,
            largest_contentful_paint: performanceData.lcp,
            cls: performanceData.cls,
            fid: performanceData.fid,
            tbt: performanceData.tbt,

            // Scroll depth (tracked separately)
            scroll_depth: window._analyticsScrollDepth || null
        };

        // Get UTM parameters
        var utm = getUTMParams();
        if (Object.keys(utm).length > 0) {
            data.utm = utm;
            storeUTM(utm);
        } else {
            // Use stored UTM
            var storedUTM = getStoredUTM();
            if (storedUTM) {
                data.utm = storedUTM;
            }

            // Include first touch
            var firstTouch = getFirstTouchUTM();
            if (firstTouch) {
                data.first_utm = firstTouch;
            }
        }

        return data;
    }

    /**
     * Get network connection type
     */
    function getConnectionType() {
        var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            return connection.effectiveType || connection.type || '';
        }
        return '';
    }

    /**
     * Get performance metrics
     */
    function getPerformanceData() {
        var data = {
            loadTime: 0,
            domReady: 0,
            ttfb: 0,
            firstPaint: 0,
            fcp: 0,
            lcp: 0,
            cls: 0,
            fid: 0,
            tbt: 0
        };

        try {
            if (window.performance && window.performance.timing) {
                var timing = window.performance.timing;
                var navigation = window.performance.navigation;

                // Page load time
                if (timing.loadEventEnd > 0) {
                    data.loadTime = timing.loadEventEnd - timing.navigationStart;
                    data.domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
                    data.ttfb = timing.responseStart - timing.requestStart;
                }
            }

            // Paint timings (Chrome only)
            if (window.performance && window.performance.getEntriesByType) {
                var paintEntries = window.performance.getEntriesByType('paint');
                paintEntries.forEach(function (entry) {
                    if (entry.name === 'first-contentful-paint') {
                        data.fcp = entry.startTime;
                    }
                });
            }

            // Largest Contentful Paint
            if (window.performance && window.PerformanceObserver) {
                try {
                    var lcpObserver = new PerformanceObserver(function (list) {
                        var entries = list.getEntries();
                        var lastEntry = entries[entries.length - 1];
                        data.lcp = lastEntry.startTime;
                    });
                    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                } catch (e) {
                    // LCP not supported
                }
            }

            // Cumulative Layout Shift
            if (window.performance && window.PerformanceObserver) {
                try {
                    var clsObserver = new PerformanceObserver(function (list) {
                        var entries = list.getEntries();
                        var cls = 0;
                        entries.forEach(function (entry) {
                            if (!entry.hadRecentInput) {
                                cls += entry.value;
                            }
                        });
                        data.cls = cls;
                    });
                    clsObserver.observe({ entryTypes: ['layout-shift'] });
                } catch (e) {
                    // CLS not supported
                }
            }

            // First Input Delay
            if (window.performance && window.PerformanceObserver) {
                try {
                    var fidObserver = new PerformanceObserver(function (list) {
                        var entries = list.getEntries();
                        var firstEntry = entries[0];
                        data.fid = firstEntry.processingStart - firstEntry.startTime;
                    });
                    fidObserver.observe({ entryTypes: ['first-input'] });
                } catch (e) {
                    // FID not supported
                }
            }

        } catch (e) {
            log('Performance API error:', e);
        }

        // Convert to seconds for consistency
        data.loadTime = data.loadTime / 1000;
        data.domReady = data.domReady / 1000;
        data.ttfb = data.ttfb / 1000;
        data.fcp = data.fcp / 1000;
        data.lcp = data.lcp / 1000;
        data.fid = data.fid / 1000;
        data.tbt = data.tbt / 1000;

        return data;
    }

    /**
     * Send data to server
     */
    function sendData(data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', API_URL, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('X-Project-ID', PROJECT_ID);

        if (API_KEY) {
            xhr.setRequestHeader('X-API-Key', API_KEY);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    log('Track success:', xhr.responseText);
                    if (callback) callback(true, xhr.responseText);
                } else {
                    log('Track error:', xhr.status);
                    if (callback) callback(false, xhr.status);
                }
            }
        };

        xhr.send(JSON.stringify(data));
    }

    /**
     * Track page view
     */
    function trackPageView() {
        var perfData = getPerformanceData();
        var data = getPageData(perfData);

        log('Tracking page view:', data);

        // Update session
        updateSession();

        sendData(data, function (success, response) {
            if (success) {
                try {
                    var session = getSession();
                    sessionStorage.setItem('analytics_session', JSON.stringify(session));
                } catch (e) {
                    // Ignore
                }
            }
        });
    }

    /**
     * Track time on page before unload
     */
    function trackTimeOnPage() {
        if (!pageStartTime) return;

        var timeOnPage = (Date.now() - pageStartTime) / 1000;

        var data = {
            project_id: PROJECT_ID,
            session_id: getSession().id,
            page: window.location.pathname,
            time_on_page: timeOnPage
        };

        // Send beacon if available
        if (navigator.sendBeacon) {
            var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            navigator.sendBeacon(API_URL, blob);
        } else {
            // Fallback to XHR
            sendData(data);
        }
    }

    /**
     * Track custom event
     */
    function trackEvent(category, action, label, value) {
        var perfData = getPerformanceData();
        var data = getPageData(perfData);

        data.type = 'event';
        data.category = category;
        data.action = action;
        data.label = label || '';
        data.value = value || 0;

        log('Tracking event:', data);
        sendData(data);
    }

    /**
     * Track scroll depth
     */
    function trackScrollDepth() {
        var maxScroll = 0;
        var scrollThresholds = [25, 50, 75, 100];
        var reachedThresholds = [];

        function updateScroll() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var scrollPercent = (scrollTop / docHeight) * 100;

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;

                scrollThresholds.forEach(function (threshold) {
                    if (maxScroll >= threshold && reachedThresholds.indexOf(threshold) === -1) {
                        reachedThresholds.push(threshold);

                        // Track when each threshold is reached
                        trackEvent('scroll', 'depth', threshold + '%', maxScroll);
                    }
                });
            }
        }

        // Track scroll depth periodically
        var scrollTimeout;
        window.addEventListener('scroll', function () {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateScroll, 100);
        });

        // Store max scroll for page view tracking
        window._analyticsScrollDepth = maxScroll;
    }

    /**
     * Initialize tracker
     */
    function init() {
        // Initialize session
        getSession();

        // Start page timing
        pageStartTime = Date.now();

        // Track initial page view
        if (document.readyState === 'complete') {
            trackPageView();
        } else {
            window.addEventListener('load', trackPageView);
        }

        // Track scroll depth
        trackScrollDepth();

        // Track link clicks
        document.addEventListener('click', function (e) {
            var target = e.target;
            var link = target.closest ? target.closest('a') : null;
            if (!link) return;

            var href = link.getAttribute('href');
            if (!href) return;

            var text = (link.textContent || link.innerText || 'link').substring(0, 50);
            var isExternal = false;

            try {
                var linkUrl = new URL(href, window.location.origin);
                if (linkUrl.origin !== window.location.origin) isExternal = true;
            } catch (e) { return; }

            trackEvent('link_click', isExternal ? 'external' : 'internal', text, href);
        });

        // Track time on page before unload
        window.addEventListener('beforeunload', trackTimeOnPage);

        // Track visibility changes (for tab switching)
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'hidden') {
                trackTimeOnPage();
            } else if (document.visibilityState === 'visible') {
                pageStartTime = Date.now();
            }
        });

        // SPA support - track history changes
        if (history.pushState) {
            var originalPushState = history.pushState;
            history.pushState = function () {
                // Track time on previous page before navigation
                trackTimeOnPage();

                originalPushState.apply(this, arguments);

                // Track new page after a short delay
                setTimeout(function () {
                    pageStartTime = Date.now();
                    trackPageView();
                }, 100);
            };

            window.addEventListener('popstate', function () {
                trackTimeOnPage();
                setTimeout(function () {
                    pageStartTime = Date.now();
                    trackPageView();
                }, 100);
            });
        }

        // Expose global API
        window.Analytics = {
            trackPageView: trackPageView,
            trackEvent: trackEvent,
            trackScrollDepth: trackScrollDepth,
            getUTMParams: getUTMParams,
            getFirstTouchUTM: getFirstTouchUTM,
            getStoredUTM: getStoredUTM,
            getSession: getSession,
            getPerformanceData: getPerformanceData,
            config: config
        };

        log('Analytics initialized with project:', PROJECT_ID);
    }

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
