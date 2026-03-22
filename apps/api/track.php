<?php
/**
 * Advanced Analytics Tracker v2.0
 * 
 * Features:
 * - API Key authentication for global multi-project access
 * - Project/site support for tracking multiple websites
 * - Time on page tracking
 * - Page fully loaded metrics (performance timing)
 * - UTM attribution with first/last touch
 * - File-based JSON database
 * 
 * Version: 2.0.0
 * Host at: api.preciousadedokun.com.ng/v1/analytics
 */

// Configuration
define('DATA_DIR', __DIR__ . '/data');
define('PROJECTS_FILE', DATA_DIR . '/projects.json');
define('PAGEVIEWS_FILE', DATA_DIR . '/pageviews.json');
define('SESSIONS_FILE', DATA_DIR . '/sessions.json');
define('UTM_FILE', DATA_DIR . '/utm.json');
define('REFERRERS_FILE', DATA_DIR . '/referrers.json');
define('DEVICES_FILE', DATA_DIR . '/devices.json');
define('LOCATIONS_FILE', DATA_DIR . '/locations.json');
define('EVENTS_FILE', DATA_DIR . '/events.json');
define('PERFORMANCE_FILE', DATA_DIR . '/performance.json');
define('PAGETIME_FILE', DATA_DIR . '/pagetime.json');

// API Keys configuration - Add your keys here
define('API_KEYS', [
    // Global API key - anyone can use this
    'global_analytics_key_2024' => 'global',
    // Add more keys as needed: 'your_key_here' => 'project_id'
]);

// Cache configuration
define('CACHE_ENABLED', true);
define('CACHE_DIR', __DIR__ . '/cache');
define('CACHE_TTL', 60); // 60 seconds default TTL

// Ensure cache directory exists
if (!file_exists(CACHE_DIR)) {
    mkdir(CACHE_DIR, 0755, true);
}

/**
 * Simple file-based cache
 */
function getCached($key, $ttl = CACHE_TTL) {
    if (!CACHE_ENABLED) return null;
    
    $cacheFile = CACHE_DIR . '/' . md5($key) . '.json';
    if (file_exists($cacheFile)) {
        $cache = json_decode(file_get_contents($cacheFile), true);
        if ($cache && $cache['expires'] > time()) {
            return $cache['data'];
        }
    }
    return null;
}

function setCache($key, $data, $ttl = CACHE_TTL) {
    if (!CACHE_ENABLED) return;
    
    $cacheFile = CACHE_DIR . '/' . md5($key) . '.json';
    $cache = [
        'data' => $data,
        'expires' => time() + $ttl
    ];
    file_put_contents($cacheFile, json_encode($cache));
}

function clearCache($pattern = null) {
    if (!CACHE_ENABLED) return;
    
    if ($pattern) {
        // Clear specific cache
        $cacheKey = md5($pattern);
        $cacheFile = CACHE_DIR . '/' . $cacheKey . '.json';
        if (file_exists($cacheFile)) {
            @unlink($cacheFile);
        }
    } else {
        // Clear all cache
        $files = glob(CACHE_DIR . '/*.json');
        if ($files) {
            foreach ($files as $file) {
                @unlink($file);
            }
        }
    }
}

// Ensure data directory exists
if (!file_exists(DATA_DIR)) {
    mkdir(DATA_DIR, 0755, true);
}

// Initialize JSON files if they don't exist
$defaultFiles = [
    PROJECTS_FILE => ['projects' => []],
    PAGEVIEWS_FILE => ['pageviews' => []],
    SESSIONS_FILE => ['sessions' => []],
    UTM_FILE => ['utm' => []],
    REFERRERS_FILE => ['referrers' => []],
    DEVICES_FILE => ['devices' => []],
    LOCATIONS_FILE => ['locations' => []],
    EVENTS_FILE => ['events' => []],
    PERFORMANCE_FILE => ['performance' => []],
    PAGETIME_FILE => ['pagetime' => []]
];

foreach ($defaultFiles as $file => $default) {
    if (!file_exists($file)) {
        file_put_contents($file, json_encode($default));
    }
}

/**
 * Get client IP address
 */
function getClientIP() {
    $ip = '';
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    }
    // Get first IP if multiple
    if (strpos($ip, ',') !== false) {
        $ip = trim(explode(',', $ip)[0]);
    }
    return $ip;
}

/**
 * Detect device type from user agent
 */
function detectDevice($userAgent) {
    $device = 'desktop';
    $userAgent = $userAgent ?? '';
    if (preg_match('/mobile/i', $userAgent)) {
        $device = 'mobile';
    } elseif (preg_match('/tablet|iPad/i', $userAgent)) {
        $device = 'tablet';
    } elseif (preg_match('/bot|crawler|spider|slurp/i', $userAgent)) {
        $device = 'bot';
    }
    return $device;
}

/**
 * Detect browser from user agent
 */
function detectBrowser($userAgent) {
    $browser = 'unknown';
    $userAgent = $userAgent ?? '';
    if (preg_match('/Chrome\/(\d+)/i', $userAgent, $match)) {
        if (preg_match('/Edg\//i', $userAgent)) {
            $browser = 'edge';
        } else {
            $browser = 'chrome';
        }
    } elseif (preg_match('/Firefox\/(\d+)/i', $userAgent)) {
        $browser = 'firefox';
    } elseif (preg_match('/Safari\//i', $userAgent) && !preg_match('/Chrome/i', $userAgent)) {
        $browser = 'safari';
    } elseif (preg_match('/Opera|OPR/i', $userAgent)) {
        $browser = 'opera';
    } elseif (preg_match('/MSIE|Trident/i', $userAgent)) {
        $browser = 'ie';
    }
    return $browser;
}

/**
 * Detect OS from user agent
 */
function detectOS($userAgent) {
    $os = 'unknown';
    $userAgent = $userAgent ?? '';
    if (preg_match('/Windows NT 10/i', $userAgent)) {
        $os = 'windows_10';
    } elseif (preg_match('/Windows/i', $userAgent)) {
        $os = 'windows';
    } elseif (preg_match('/Mac OS X/i', $userAgent)) {
        $os = 'macos';
    } elseif (preg_match('/Linux/i', $userAgent)) {
        $os = 'linux';
    } elseif (preg_match('/Android/i', $userAgent)) {
        $os = 'android';
    } elseif (preg_match('/iOS|iPhone|iPad/i', $userAgent)) {
        $os = 'ios';
    }
    return $os;
}

/**
 * Get geolocation from IP (using ip-api.com free service)
 */
function getLocation($ip) {
    // Skip private IPs
    if (empty($ip) || filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
        return [
            'country' => 'Local',
            'city' => 'Local',
            'region' => 'Local',
            'timezone' => 'Local',
            'isp' => 'Local'
        ];
    }
    
    $cacheFile = DATA_DIR . '/geo_' . md5($ip) . '.json';
    $cacheTime = 86400; // 24 hours cache
    
    if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheTime)) {
        return json_decode(file_get_contents($cacheFile), true);
    }
    
    // Use ip-api.com for geolocation (free tier: 45 requests/minute)
    try {
        $response = @file_get_contents('http://ip-api.com/json/' . $ip . '?fields=status,country,city,regionName,timezone,isp,query');
        if ($response) {
            $data = json_decode($response, true);
            if ($data && $data['status'] === 'success') {
                $result = [
                    'country' => $data['country'] ?? 'Unknown',
                    'city' => $data['city'] ?? 'Unknown',
                    'region' => $data['regionName'] ?? 'Unknown',
                    'timezone' => $data['timezone'] ?? 'Unknown',
                    'isp' => $data['isp'] ?? 'Unknown'
                ];
                // Cache the result
                file_put_contents($cacheFile, json_encode($result));
                return $result;
            }
        }
    } catch (Exception $e) {
        // Fallback to basic
    }
    
    return [
        'country' => 'Unknown',
        'city' => 'Unknown',
        'region' => 'Unknown',
        'timezone' => 'Unknown',
        'isp' => 'Unknown'
    ];
}

/**
 * Save data to JSON file with locking
 */
function saveData($file, $data) {
    $json = json_encode($data, JSON_PRETTY_PRINT);
    file_put_contents($file, $json, LOCK_EX);
}

/**
 * Read data from JSON file
 */
function readData($file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        return json_decode($content, true) ?: [];
    }
    return [];
}

/**
 * Verify API key
 */
function verifyAPIKey($apiKey, $projectId = null) {
    if (empty($apiKey)) {
        return ['valid' => false, 'error' => 'API key required'];
    }
    
    if (isset(API_KEYS[$apiKey])) {
        $allowedProject = API_KEYS[$apiKey];
        // Global key can access any project
        if ($allowedProject === 'global') {
            return ['valid' => true, 'project_id' => $projectId ?? 'default'];
        }
        // Specific key must match project
        if ($projectId === null || $allowedProject === $projectId) {
            return ['valid' => true, 'project_id' => $allowedProject];
        }
    }
    
    return ['valid' => false, 'error' => 'Invalid API key'];
}

/**
 * Register or get project
 */
function registerProject($projectId, $name = '', $domain = '') {
    $projects = readData(PROJECTS_FILE);
    
    if (!isset($projects['projects'][$projectId])) {
        $projects['projects'][$projectId] = [
            'id' => $projectId,
            'name' => $name ?: $projectId,
            'domain' => $domain,
            'created' => time(),
            'last_active' => time()
        ];
    } else {
        $projects['projects'][$projectId]['last_active'] = time();
        if ($name) $projects['projects'][$projectId]['name'] = $name;
        if ($domain) $projects['projects'][$projectId]['domain'] = $domain;
    }
    
    saveData(PROJECTS_FILE, $projects);
    return $projects['projects'][$projectId];
}

/**
 * Track page view with full metrics
 */
function trackPageView($data, $projectId) {
    $timestamp = time();
    $date = date('Y-m-d', $timestamp);
    $hour = (int)date('H', $timestamp);
    
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $ip = getClientIP();
    
    $pageview = [
        'id' => uniqid('pv_'),
        'project_id' => $projectId,
        'timestamp' => $timestamp,
        'datetime' => date('Y-m-d H:i:s', $timestamp),
        'date' => $date,
        'hour' => $hour,
        'page' => $data['page'] ?? '/',
        'title' => $data['title'] ?? '',
        'page_url' => $data['page_url'] ?? '',
        'ip' => $ip,
        'user_agent' => $userAgent,
        'device' => detectDevice($userAgent),
        'browser' => detectBrowser($userAgent),
        'os' => detectOS($userAgent),
        'referrer' => $data['referrer'] ?? $_SERVER['HTTP_REFERER'] ?? '',
        'screen_resolution' => $data['screen'] ?? '',
        'language' => $data['language'] ?? '',
        'viewport' => $data['viewport'] ?? '',
        'color_depth' => $data['color_depth'] ?? '',
        'connection_type' => $data['connection'] ?? '',
        'cookies_enabled' => $data['cookies'] ?? true,
        'js_enabled' => $data['js'] ?? true,
        // Time tracking
        'session_id' => $data['session_id'] ?? '',
        'page_load_time' => isset($data['page_load_time']) ? floatval($data['page_load_time']) : null,
        'dom_ready_time' => isset($data['dom_ready_time']) ? floatval($data['dom_ready_time']) : null,
        'time_on_page' => isset($data['time_on_page']) ? floatval($data['time_on_page']) : null,
        'scroll_depth' => $data['scroll_depth'] ?? null,
        // Performance metrics
        'ttfb' => isset($data['ttfb']) ? floatval($data['ttfb']) : null,
        'first_paint' => isset($data['first_paint']) ? floatval($data['first_paint']) : null,
        'first_contentful_paint' => isset($data['first_contentful_paint']) ? floatval($data['first_contentful_paint']) : null,
        'largest_contentful_paint' => isset($data['largest_contentful_paint']) ? floatval($data['largest_contentful_paint']) : null,
        'cumulative_layout_shift' => isset($data['cls']) ? floatval($data['cls']) : null,
        'first_input_delay' => isset($data['fid']) ? floatval($data['fid']) : null,
        'total_blocking_time' => isset($data['tbt']) ? floatval($data['tbt']) : null,
    ];
    
    // Add location
    $location = getLocation($ip);
    $pageview = array_merge($pageview, $location);
    
    // Save pageview
    $pageviews = readData(PAGEVIEWS_FILE);
    $pageviews['pageviews'][] = $pageview;
    
    // Keep last 50000 pageviews per project
    $projectPageviews = array_filter($pageviews['pageviews'], function($pv) use ($projectId) {
        return $pv['project_id'] === $projectId;
    });
    if (count($projectPageviews) > 50000) {
        // Remove oldest
        $pageviews['pageviews'] = array_slice($pageviews['pageviews'], -50000);
    }
    
    saveData(PAGEVIEWS_FILE, $pageviews);
    
    // Track other metrics
    if (!empty($pageview['referrer'])) {
        trackReferrer($pageview['referrer'], $date, $projectId);
    }
    trackDevice($pageview['device'], $date, $projectId);
    trackLocation($pageview['country'], $date, $projectId);
    
    // Track UTM
    if (!empty($data['utm'])) {
        trackUTM($data['utm'], $date, $projectId);
    }
    
    // Track performance
    if (!empty($data['page_load_time'])) {
        trackPerformance($pageview, $projectId);
    }
    
    // Track page time
    if (!empty($data['time_on_page']) || !empty($data['page_load_time'])) {
        trackPageTime($pageview, $projectId);
    }
    
    // Track session
    if (!empty($data['session_id'])) {
        updateSession($data['session_id'], $projectId, $pageview);
    }
    
    return ['success' => true, 'id' => $pageview['id']];
}

/**
 * Track referrer
 */
function trackReferrer($referrer, $date, $projectId) {
    $referrers = readData(REFERRERS_FILE);
    
    $domain = parse_url($referrer, PHP_URL_HOST);
    $fullUrl = $referrer; // Save full URL with all query params
    
    if ($domain) {
        $key = $projectId . '|' . $domain;
        
        if (!isset($referrers['referrers'][$key])) {
            $referrers['referrers'][$key] = [
                'project_id' => $projectId,
                'domain' => $domain,
                'full_url' => $fullUrl, // Store full URL
                'total' => 0,
                'dates' => []
            ];
        }
        $referrers['referrers'][$key]['total']++;
        $referrers['referrers'][$key]['full_url'] = $fullUrl; // Update with latest
        
        if (!isset($referrers['referrers'][$key]['dates'][$date])) {
            $referrers['referrers'][$key]['dates'][$date] = 0;
        }
        $referrers['referrers'][$key]['dates'][$date]++;
        
        // Also track full URLs separately for detailed view
        $urlKey = $projectId . '|' . md5($fullUrl);
        if (!isset($referrers['full_urls'][$urlKey])) {
            $query = parse_url($fullUrl, PHP_URL_QUERY);
            $referrers['full_urls'][$urlKey] = [
                'project_id' => $projectId,
                'url' => $fullUrl,
                'domain' => $domain,
                'query_string' => $query ?: '',
                'query_params' => [],
                'total' => 0,
                'dates' => []
            ];
            
            // Parse query params
            if ($query) {
                parse_str($query, $params);
                foreach ($params as $param => $value) {
                    $referrers['full_urls'][$urlKey]['query_params'][$param] = $value;
                }
            }
        }
        $referrers['full_urls'][$urlKey]['total']++;
        
        if (!isset($referrers['full_urls'][$urlKey]['dates'][$date])) {
            $referrers['full_urls'][$urlKey]['dates'][$date] = 0;
        }
        $referrers['full_urls'][$urlKey]['dates'][$date]++;
    }
    
    saveData(REFERRERS_FILE, $referrers);
}

/**
 * Track device
 */
function trackDevice($device, $date, $projectId) {
    $devices = readData(DEVICES_FILE);
    $key = $projectId . '|' . $device;
    
    if (!isset($devices['devices'][$key])) {
        $devices['devices'][$key] = [
            'project_id' => $projectId,
            'device' => $device,
            'total' => 0,
            'dates' => []
        ];
    }
    $devices['devices'][$key]['total']++;
    
    if (!isset($devices['devices'][$key]['dates'][$date])) {
        $devices['devices'][$key]['dates'][$date] = 0;
    }
    $devices['devices'][$key]['dates'][$date]++;
    
    saveData(DEVICES_FILE, $devices);
}

/**
 * Track location
 */
function trackLocation($country, $date, $projectId) {
    $locations = readData(LOCATIONS_FILE);
    $key = $projectId . '|' . $country;
    
    if (!isset($locations['locations'][$key])) {
        $locations['locations'][$key] = [
            'project_id' => $projectId,
            'country' => $country,
            'total' => 0,
            'dates' => []
        ];
    }
    $locations['locations'][$key]['total']++;
    
    if (!isset($locations['locations'][$key]['dates'][$date])) {
        $locations['locations'][$key]['dates'][$date] = 0;
    }
    $locations['locations'][$key]['dates'][$date]++;
    
    saveData(LOCATIONS_FILE, $locations);
}

/**
 * Track UTM parameters
 */
function trackUTM($utm, $date, $projectId) {
    $utmData = readData(UTM_FILE);
    $params = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', 'utm_cid'];
    
    foreach ($params as $param) {
        if (!empty($utm[$param])) {
            $value = $utm[$param];
            $key = $projectId . '|' . $param . '|' . $value;
            
            if (!isset($utmData['utm'][$key])) {
                $utmData['utm'][$key] = [
                    'project_id' => $projectId,
                    'param' => $param,
                    'value' => $value,
                    'total' => 0,
                    'dates' => []
                ];
            }
            
            $utmData['utm'][$key]['total']++;
            
            if (!isset($utmData['utm'][$key]['dates'][$date])) {
                $utmData['utm'][$key]['dates'][$date] = 0;
            }
            $utmData['utm'][$key]['dates'][$date]++;
        }
    }
    
    // Track UTM combinations
    if (!empty($utm['utm_source']) && !empty($utm['utm_medium'])) {
        $comboKey = $projectId . '|' . $utm['utm_source'] . '|' . $utm['utm_medium'];
        if (!empty($utm['utm_campaign'])) {
            $comboKey .= '|' . $utm['utm_campaign'];
        }
        
        if (!isset($utmData['utm']['combinations'][$comboKey])) {
            $utmData['utm']['combinations'][$comboKey] = [
                'project_id' => $projectId,
                'source' => $utm['utm_source'],
                'medium' => $utm['utm_medium'],
                'campaign' => $utm['utm_campaign'] ?? '',
                'total' => 0,
                'dates' => []
            ];
        }
        
        $utmData['utm']['combinations'][$comboKey]['total']++;
        
        if (!isset($utmData['utm']['combinations'][$comboKey]['dates'][$date])) {
            $utmData['utm']['combinations'][$comboKey]['dates'][$date] = 0;
        }
        $utmData['utm']['combinations'][$comboKey]['dates'][$date]++;
    }
    
    saveData(UTM_FILE, $utmData);
}

/**
 * Track performance metrics
 */
function trackPerformance($pageview, $projectId) {
    $perf = readData(PERFORMANCE_FILE);
    
    $key = $projectId . '|' . $pageview['page'];
    if (!isset($perf['performance'][$key])) {
        $perf['performance'][$key] = [
            'project_id' => $projectId,
            'page' => $pageview['page'],
            'loads' => 0,
            'total_load_time' => 0,
            'avg_load_time' => 0,
            'min_load_time' => PHP_FLOAT_MAX,
            'max_load_time' => 0,
            'total_ttfb' => 0,
            'avg_ttfb' => 0,
            'total_dom_ready' => 0,
            'avg_dom_ready' => 0,
        ];
    }
    
    $p = &$perf['performance'][$key];
    $p['loads']++;
    
    if ($pageview['page_load_time']) {
        $p['total_load_time'] += $pageview['page_load_time'];
        $p['avg_load_time'] = $p['total_load_time'] / $p['loads'];
        $p['min_load_time'] = min($p['min_load_time'], $pageview['page_load_time']);
        $p['max_load_time'] = max($p['max_load_time'], $pageview['page_load_time']);
    }
    
    if ($pageview['ttfb']) {
        $p['total_ttfb'] += $pageview['ttfb'];
        $p['avg_ttfb'] = $p['total_ttfb'] / $p['loads'];
    }
    
    if ($pageview['dom_ready_time']) {
        $p['total_dom_ready'] += $pageview['dom_ready_time'];
        $p['avg_dom_ready'] = $p['total_dom_ready'] / $p['loads'];
    }
    
    saveData(PERFORMANCE_FILE, $perf);
}

/**
 * Track time on page
 */
function trackPageTime($pageview, $projectId) {
    $pageTime = readData(PAGETIME_FILE);
    
    $key = $projectId . '|' . $pageview['page'];
    if (!isset($pageTime['pagetime'][$key])) {
        $pageTime['pagetime'][$key] = [
            'project_id' => $projectId,
            'page' => $pageview['page'],
            'views' => 0,
            'total_time' => 0,
            'avg_time' => 0,
            'min_time' => PHP_FLOAT_MAX,
            'max_time' => 0,
        ];
    }
    
    $pt = &$pageTime['pagetime'][$key];
    $pt['views']++;
    
    // Track page load time as time on page for initial load
    if ($pageview['page_load_time']) {
        $pt['total_time'] += $pageview['page_load_time'];
        $pt['avg_time'] = $pt['total_time'] / $pt['views'];
        $pt['min_time'] = min($pt['min_time'], $pageview['page_load_time']);
        $pt['max_time'] = max($pt['max_time'], $pageview['page_load_time']);
    }
    
    // Track explicit time_on_page for page exits
    if ($pageview['time_on_page']) {
        // Update existing entry with exit time
    }
    
    saveData(PAGETIME_FILE, $pageTime);
}

/**
 * Update session data
 */
function updateSession($sessionId, $projectId, $pageview) {
    $sessions = readData(SESSIONS_FILE);
    
    if (!isset($sessions['sessions'][$sessionId])) {
        $sessions['sessions'][$sessionId] = [
            'id' => $sessionId,
            'project_id' => $projectId,
            'start_time' => $pageview['timestamp'],
            'last_active' => $pageview['timestamp'],
            'page_count' => 0,
            'ip' => $pageview['ip'],
            'device' => $pageview['device'],
            'browser' => $pageview['browser'],
            'country' => $pageview['country'],
            'first_page' => $pageview['page'],
            'utm' => $pageview['utm'] ?? null,
            'pages' => []
        ];
    }
    
    $s = &$sessions['sessions'][$sessionId];
    $s['last_active'] = $pageview['timestamp'];
    $s['page_count']++;
    $s['pages'][] = [
        'page' => $pageview['page'],
        'time' => $pageview['timestamp'],
        'time_on_page' => $pageview['time_on_page']
    ];
    
    // Keep only last 50 pages per session
    if (count($s['pages']) > 50) {
        $s['pages'] = array_slice($s['pages'], -50);
    }
    
    // Calculate session duration
    $s['duration'] = $s['last_active'] - $s['start_time'];
    
    saveData(SESSIONS_FILE, $sessions);
}

/**
 * Track custom event
 */
function trackEvent($data, $projectId) {
    $timestamp = time();
    $date = date('Y-m-d', $timestamp);
    
    $event = [
        'id' => uniqid('ev_'),
        'project_id' => $projectId,
        'timestamp' => $timestamp,
        'datetime' => date('Y-m-d H:i:s', $timestamp),
        'date' => $date,
        'category' => $data['category'] ?? 'general',
        'action' => $data['action'] ?? '',
        'label' => $data['label'] ?? '',
        'value' => isset($data['value']) ? floatval($data['value']) : 0,
        'page' => $data['page'] ?? '/',
        'session_id' => $data['session_id'] ?? '',
        'ip' => getClientIP()
    ];
    
    $events = readData(EVENTS_FILE);
    $events['events'][] = $event;
    
    // Keep last 10000 events per project
    $projectEvents = array_filter($events['events'], function($e) use ($projectId) {
        return $e['project_id'] === $projectId;
    });
    if (count($projectEvents) > 10000) {
        $events['events'] = array_slice($events['events'], -10000);
    }
    
    saveData(EVENTS_FILE, $events);
    
    return ['success' => true, 'id' => $event['id']];
}

/**
 * Get analytics summary with project filter
 */
function getSummary($projectId, $days = 7) {
    $pageviews = readData(PAGEVIEWS_FILE);
    $utm = readData(UTM_FILE);
    $referrers = readData(REFERRERS_FILE);
    $devices = readData(DEVICES_FILE);
    $locations = readData(LOCATIONS_FILE);
    $performance = readData(PERFORMANCE_FILE);
    $pageTime = readData(PAGETIME_FILE);
    $sessions = readData(SESSIONS_FILE);
    
    // Filter by project
    $projectPageviews = array_filter($pageviews['pageviews'], function($pv) use ($projectId) {
        return $pv['project_id'] === $projectId;
    });
    
    // Get unique visitors
    $uniqueVisitors = [];
    foreach ($projectPageviews as $pv) {
        $uniqueVisitors[$pv['ip']] = true;
    }
    
    // Get unique sessions
    $uniqueSessions = [];
    foreach ($sessions['sessions'] as $s) {
        if ($s['project_id'] === $projectId) {
            $uniqueSessions[$s['id']] = $s;
        }
    }
    
    // Get top pages
    $pages = [];
    foreach ($projectPageviews as $pv) {
        $page = $pv['page'];
        if (!isset($pages[$page])) {
            $pages[$page] = 0;
        }
        $pages[$page]++;
    }
    arsort($pages);
    
    // Calculate average metrics
    $totalLoadTime = 0;
    $loadCount = 0;
    foreach ($projectPageviews as $pv) {
        if ($pv['page_load_time']) {
            $totalLoadTime += $pv['page_load_time'];
            $loadCount++;
        }
    }
    $avgLoadTime = $loadCount > 0 ? $totalLoadTime / $loadCount : 0;
    
    // Calculate avg session duration
    $totalDuration = 0;
    $sessionCount = 0;
    foreach ($uniqueSessions as $s) {
        if (isset($s['duration'])) {
            $totalDuration += $s['duration'];
            $sessionCount++;
        }
    }
    $avgSessionDuration = $sessionCount > 0 ? $totalDuration / $sessionCount : 0;
    
    return [
        'summary' => [
            'total_pageviews' => count($projectPageviews),
            'unique_visitors' => count($uniqueVisitors),
            'total_sessions' => count($uniqueSessions),
            'avg_session_duration' => round($avgSessionDuration, 2),
            'avg_page_load_time' => round($avgLoadTime, 2),
            'top_pages' => array_slice($pages, 0, 15, true),
            'devices' => array_filter($devices['devices'], function($d) use ($projectId) {
                return $d['project_id'] === $projectId;
            }),
            'locations' => array_filter($locations['locations'], function($l) use ($projectId) {
                return $l['project_id'] === $projectId;
            }),
            'top_referrers' => array_slice(array_filter($referrers['referrers'], function($r) use ($projectId) {
                return $r['project_id'] === $projectId;
            }), 0, 10, true),
        ],
        'period' => $days . ' days',
        'project_id' => $projectId
    ];
}

/**
 * Get detailed analytics
 */
function getAnalytics($projectId, $type = 'all', $startDate = null, $endDate = null) {
    $result = [];
    
    switch ($type) {
        case 'pageviews':
            $data = readData(PAGEVIEWS_FILE);
            $result = array_filter($data['pageviews'], function($pv) use ($projectId) {
                return $pv['project_id'] === $projectId;
            });
            break;
        case 'utm':
            $data = readData(UTM_FILE);
            $result = array_filter($data['utm'], function($u) use ($projectId) {
                return $u['project_id'] === $projectId;
            });
            break;
        case 'referrers':
            $data = readData(REFERRERS_FILE);
            $result = array_filter($data['referrers'], function($r) use ($projectId) {
                return $r['project_id'] === $projectId;
            });
            break;
        case 'devices':
            $data = readData(DEVICES_FILE);
            $result = array_filter($data['devices'], function($d) use ($projectId) {
                return $d['project_id'] === $projectId;
            });
            break;
        case 'locations':
            $data = readData(LOCATIONS_FILE);
            $result = array_filter($data['locations'], function($l) use ($projectId) {
                return $l['project_id'] === $projectId;
            });
            break;
        case 'events':
            $data = readData(EVENTS_FILE);
            $result = array_filter($data['events'], function($e) use ($projectId) {
                return $e['project_id'] === $projectId;
            });
            break;
        case 'performance':
            $data = readData(PERFORMANCE_FILE);
            $result = array_filter($data['performance'], function($p) use ($projectId) {
                return $p['project_id'] === $projectId;
            });
            break;
        case 'pagetime':
            $data = readData(PAGETIME_FILE);
            $result = array_filter($data['pagetime'], function($pt) use ($projectId) {
                return $pt['project_id'] === $projectId;
            });
            break;
        case 'sessions':
            $data = readData(SESSIONS_FILE);
            $result = array_filter($data['sessions'], function($s) use ($projectId) {
                return $s['project_id'] === $projectId;
            });
            break;
        default:
            $pageviews = readData(PAGEVIEWS_FILE);
            $result = [
                'pageviews' => array_filter($pageviews['pageviews'], function($pv) use ($projectId) {
                    return $pv['project_id'] === $projectId;
                }),
                'utm' => array_filter(readData(UTM_FILE)['utm'], function($u) use ($projectId) {
                    return $u['project_id'] === $projectId;
                }),
                'referrers' => array_filter(readData(REFERRERS_FILE)['referrers'], function($r) use ($projectId) {
                    return $r['project_id'] === $projectId;
                }),
                'devices' => array_filter(readData(DEVICES_FILE)['devices'], function($d) use ($projectId) {
                    return $d['project_id'] === $projectId;
                }),
                'locations' => array_filter(readData(LOCATIONS_FILE)['locations'], function($l) use ($projectId) {
                    return $l['project_id'] === $projectId;
                }),
                'events' => array_filter(readData(EVENTS_FILE)['events'], function($e) use ($projectId) {
                    return $e['project_id'] === $projectId;
                })
            ];
    }
    
    // Filter by date range
    if ($startDate && $endDate) {
        if (is_array($result)) {
            $result = array_filter($result, function($item) use ($startDate, $endDate) {
                return isset($item['date']) && $item['date'] >= $startDate && $item['date'] <= $endDate;
            });
        }
    }
    
    return $result;
}

/**
 * Get time series data
 */
function getTimeSeries($projectId, $metric = 'pageviews', $days = 30) {
    $data = readData(PAGEVIEWS_FILE);
    $result = [];
    
    // Generate date range
    for ($i = $days - 1; $i >= 0; $i--) {
        $date = date('Y-m-d', strtotime("-$i days"));
        $result[$date] = [
            'count' => 0,
            'unique_visitors' => 0
        ];
    }
    
    // Count by date
    $visitorsByDate = [];
    foreach ($data['pageviews'] as $pv) {
        if ($pv['project_id'] === $projectId && isset($result[$pv['date']])) {
            $result[$pv['date']]['count']++;
            $visitorsByDate[$pv['date']][$pv['ip']] = true;
        }
    }
    
    // Calculate unique visitors per day
    foreach ($result as $date => &$row) {
        if (isset($visitorsByDate[$date])) {
            $row['unique_visitors'] = count($visitorsByDate[$date]);
        }
    }
    
    return $result;
}

/**
 * Get projects list
 */
function getProjects() {
    $projects = readData(PROJECTS_FILE);
    return $projects['projects'];
}

// ==================== ROUTING ====================

// CORS - Allow all origins for global access
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, X-API-Key, X-Project-ID, Accept, Authorization');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get project ID from header or parameter
$projectId = $_SERVER['HTTP_X_PROJECT_ID'] ?? $_GET['project_id'] ?? 'default';
$apiKey = $_SERVER['HTTP_X_API_KEY'] ?? '';

// Verify API key
$auth = verifyAPIKey($apiKey, $projectId);
if (!$auth['valid']) {
    // Allow unauthenticated tracking for global access
    // But require project_id
    if (empty($projectId)) {
        http_response_code(401);
        echo json_encode(['error' => 'API key or project_id required']);
        exit;
    }
}
$projectId = $auth['project_id'] ?? $projectId;

// Route handling
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
$path = str_replace('/v1/analytics', '', $path);
$path = str_replace('/track.php', '', $path);
$path = trim($path, '/');
$method = $_SERVER['REQUEST_METHOD'];

// Debug: log the path
// file_put_contents(__DIR__ . '/debug.log', date('Y-m-d H:i:s') . " | $method | $path | ". json_encode($_GET) . "\n", FILE_APPEND);

// POST /track - Track page view or event
if ($method === 'POST' && ($path === 'track' || $path === 'track.php' || $path === '')) {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    
    // Get project from input if provided
    if (!empty($input['project_id'])) {
        $projectId = $input['project_id'];
    }
    
    // Register project if new
    registerProject($projectId, $input['project_name'] ?? '', $input['domain'] ?? '');
    
    if (!empty($input['type']) && $input['type'] === 'event') {
        $result = trackEvent($input, $projectId);
    } else {
        $result = trackPageView($input, $projectId);
    }
    
    echo json_encode($result);
    exit;
}

// GET /summary - Analytics summary
if ($method === 'GET' && $path === 'summary') {
    $days = isset($_GET['days']) ? intval($_GET['days']) : 7;
    
    // Check cache
    $cacheKey = "summary_{$projectId}_{$days}";
    $cached = getCached($cacheKey, 60); // 60 second cache
    if ($cached !== null) {
        echo json_encode($cached);
        exit;
    }
    
    $result = getSummary($projectId, $days);
    
    // Cache the result
    setCache($cacheKey, $result, 60);
    
    echo json_encode($result);
    exit;
}

// GET /analytics - Detailed analytics
if ($method === 'GET' && $path === 'analytics') {
    $type = $_GET['type'] ?? 'all';
    $startDate = $_GET['start_date'] ?? null;
    $endDate = $_GET['end_date'] ?? null;
    
    // Check cache for non-filtered requests
    if (!$startDate && !$endDate) {
        $cacheKey = "analytics_{$projectId}_{$type}";
        $cached = getCached($cacheKey, 60);
        if ($cached !== null) {
            echo json_encode($cached);
            exit;
        }
        $result = getAnalytics($projectId, $type, $startDate, $endDate);
        setCache($cacheKey, $result, 60);
    } else {
        $result = getAnalytics($projectId, $type, $startDate, $endDate);
    }
    
    echo json_encode($result);
    exit;
}

// GET /timeseries - Time series data
if ($method === 'GET' && $path === 'timeseries') {
    $metric = $_GET['metric'] ?? 'pageviews';
    $days = isset($_GET['days']) ? intval($_GET['days']) : 30;
    
    // Check cache
    $cacheKey = "timeseries_{$projectId}_{$metric}_{$days}";
    $cached = getCached($cacheKey, 60);
    if ($cached !== null) {
        echo json_encode($cached);
        exit;
    }
    
    $result = getTimeSeries($projectId, $metric, $days);
    setCache($cacheKey, $result, 60);
    
    echo json_encode($result);
    exit;
}

// GET /projects - List projects
if ($method === 'GET' && $path === 'projects') {
    $result = getProjects();
    echo json_encode(['projects' => $result]);
    exit;
}

// GET /health - Health check
if ($method === 'GET' && $path === 'health') {
    echo json_encode([
        'status' => 'healthy',
        'timestamp' => time(),
        'version' => '2.0.0',
        'projects_count' => count(getProjects()),
        'api_keys_configured' => count(API_KEYS),
        'cache_enabled' => CACHE_ENABLED
    ]);
    exit;
}

// POST /cache/clear - Clear cache
if (($method === 'POST' || $method === 'GET') && ($path === 'cache/clear' || $path === 'cache_clear')) {
    clearCache();
    echo json_encode(['success' => true, 'message' => 'Cache cleared']);
    exit;
}

// Default
http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);
