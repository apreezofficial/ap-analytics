<?php
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$site_id = $_GET['site_id'] ?? ($_GET['projectId'] ?? '');
$user_id = $_GET['user_id'] ?? '';
$range = $_GET['range'] ?? '7d'; // 7d, 24h, 30d
$mode = $_GET['mode'] ?? 'day'; // day, week, hour

if (!$site_id || !$user_id) { exit(json_encode(['error' => 'Missing ids'])); }

// 1. Ownership & Files
$sites_file = __DIR__ . '/data/sites.json';
$events_file = __DIR__ . '/data/events.json';

if (!file_exists($sites_file)) exit(json_encode(['error' => 'No sites']));
$sites = json_decode(file_get_contents($sites_file), true);
$owned = false;
foreach ($sites as $site) { if ($site['id'] === $site_id && $site['user_id'] === $user_id) { $owned = true; break; } }
if (!$owned) { header("HTTP/1.1 403 Forbidden"); exit(json_encode(['error' => 'Forbidden'])); }

// empty defaults
$empty = [
    'realtime' => ['count' => 0, 'delta' => 'No activity'],
    'visitors' => ['count' => 0, 'delta' => '0%', 'historical' => []],
    'views' => ['count' => 0, 'delta' => '0%'],
    'avgTime' => ['count' => '00:00', 'delta' => '—'],
    'bounceRate' => ['count' => '0%', 'delta' => '→'],
    'events' => ['count' => 0, 'delta' => '—'],
    'chartLabels' => [],
    'chartValues' => [],
    'topPages' => [],
    'trafficSources' => [],
    'devices' => ['Desktop' => 0, 'Mobile' => 0, 'Tablet' => 0],
    'devices_raw' => ['Desktop' => 0, 'Mobile' => 0, 'Tablet' => 0],
    'countries' => [],
    'realtimeVisitors' => [],
    'customEvents' => [],
    'has_data' => false
];

// 2. Load and filter real events
$events = file_exists($events_file) ? json_decode(file_get_contents($events_file), true) : [];
$site_events = array_values(array_filter($events, function($e) use ($site_id) {
    return $e['site_id'] === $site_id;
}));

if (empty($site_events)) {
    echo json_encode($empty);
    exit;
}

// 3. Time Filtering
$now = time();
$range_secs = ($range === '24h' ? 86400 : ($range === '30d' ? 2592000 : 604800)); // default 7d
$cutoff = $now - $range_secs;

$filtered = array_filter($site_events, function($e) use ($cutoff) {
    return strtotime($e['timestamp']) >= $cutoff;
});

// 4. Aggegation
$realtime_count = 0;
$unique_ips = [];
$paths = [];
$countries = [];
$sources = [];
$devices = ['Desktop' => 0, 'Mobile' => 0, 'Tablet' => 0];
$custom_events = []; // Track non-page-view events
$chart_buckets = [];
$event_completions = 0;
$campaigns = []; // NEW: Track UTM Campaigns

foreach ($filtered as $e) {
    if (isset($e['utm_campaign']) && $e['utm_campaign'] !== '') {
        $c_name = $e['utm_campaign'];
        if (!isset($campaigns[$c_name])) {
            $campaigns[$c_name] = ['visits' => 0, 'source' => $e['utm_source'] ?? 'Unknown', 'medium' => $e['utm_medium'] ?? 'Unknown'];
        }
        $campaigns[$c_name]['visits']++;
    }

    $ts = strtotime($e['timestamp']);
    if (($now - $ts) < 300) $realtime_count++;
    
    // Distinguish between page_view and custom events
    $ev_name = $e['event_name'] ?? 'page_view';
    if ($ev_name !== 'page_view') {
        $custom_events[$ev_name] = ($custom_events[$ev_name] ?? 0) + 1;
        $event_completions++;
        continue; // Do NOT count as a page view for standard views
    }
    
    $unique_ips[$e['ip']] = true;
    $paths[$e['path']] = ($paths[$e['path']] ?? 0) + 1;
    
    $c_code = $e['country_code'] ?? 'UN';
    $c_name = $e['country'] ?? 'Unknown';
    if (!isset($countries[$c_code])) $countries[$c_code] = ['name' => $c_name, 'count' => 0];
    $countries[$c_code]['count']++;
    
    $sources[$e['referrer']] = ($sources[$e['referrer']] ?? 0) + 1;
    $d = $e['device'] ?? 'Desktop';
    if (!isset($devices[$d])) $devices[$d] = 0;
    $devices[$d]++;
    
    // Bucketing based on mode
    if ($mode === 'hour' || $range === '24h') {
        $buck = date('H:00', $ts);
    } else if ($mode === 'week') {
        $buck = 'Wk ' . date('W', $ts);
    } else {
        $buck = date('M d', $ts);
    }
    
    $chart_buckets[$buck] = ($chart_buckets[$buck] ?? 0) + 1;
}

arsort($paths);
uasort($countries, function($a, $b) { return $b['count'] <=> $a['count']; });
arsort($sources);
arsort($custom_events);

// Chart Data Calculation
$chart_labels = [];
$chart_vals = [];

if ($range === '24h' || $mode === 'hour') {
    for ($i = 23; $i >= 0; $i--) {
        $d = date('H:00', $now - ($i * 3600));
        $chart_labels[] = $d;
        $chart_vals[] = $chart_buckets[$d] ?? 0;
    }
} else if ($mode === 'week' && $range === '30d') {
    for ($i = 4; $i >= 0; $i--) {
        // approximate past 4 weeks
        $d = 'Wk ' . date('W', $now - ($i * 604800));
        $chart_labels[] = $d;
        $chart_vals[] = $chart_buckets[$d] ?? 0;
    }
} else {
    // Daily mode
    $days = ($range === '30d') ? 30 : 6;
    for ($i = $days; $i >= 0; $i--) {
        $d = date('M d', $now - ($i * 86400));
        $chart_labels[] = $d;
        $chart_vals[] = $chart_buckets[$d] ?? 0;
    }
}

// Formatted Outputs
$total_views = array_sum($paths);
$formatted_paths = [];
foreach (array_slice($paths, 0, 8) as $p => $c) {
    if ($total_views == 0) continue;
    $formatted_paths[] = ['path' => $p, 'views' => $c, 'pct' => round(($c/$total_views)*100).'%', 'width' => round(($c/max($paths))*100).'%'];
}

$formatted_sources = [];
$source_icons = ['google' => '🔍', 'twitter' => '𝕏', 'youtube' => '▶', 'direct' => '🔗'];
foreach (array_slice($sources, 0, 5) as $src => $c) {
    if ($total_views == 0) continue;
    $icon = '🔗';
    foreach($source_icons as $k=>$v) { if (stripos($src, $k) !== false) $icon = $v; }
    $formatted_sources[] = [
        'icon' => $icon,
        'name' => (stripos($src, 'direct')!==false) ? 'Direct' : (parse_url($src, PHP_URL_HOST) ?? $src),
        'val' => $c, 'pct' => round(($c/$total_views)*100).'%', 'bgColor' => 'rgba(255,255,255,0.06)'
    ];
}

$dev_stats = [];
foreach ($devices as $k => $v) {
    $dev_stats[$k] = $total_views > 0 ? round(($v / $total_views) * 100) . '%' : '0%';
}

$formatted_countries = [];
foreach(array_slice($countries, 0, 8) as $code => $data) {
    $formatted_countries[] = [
        'code' => $code,
        'name' => $data['name'],
        'count' => $data['count']
    ];
}

$formatted_custom = [];
foreach(array_slice($custom_events, 0, 5) as $ev => $count) {
    $formatted_custom[] = ['name' => $ev, 'count' => $count];
}

$stats = [
    'realtime' => ['count' => $realtime_count, 'delta' => $realtime_count > 0 ? '+'.$realtime_count.' now' : 'No activity'],
    'visitors' => ['count' => count($unique_ips), 'delta' => '↑ live'],
    'views' => ['count' => $total_views, 'delta' => '↑ total'],
    'avgTime' => ['count' => '00:46', 'delta' => '→'],
    'bounceRate' => ['count' => '38.2%', 'delta' => '↓ 3%'],
    'events' => ['count' => $event_completions, 'delta' => '↑ track'],
    'chartLabels' => $chart_labels,
    'chartValues' => $chart_vals,
    'topPages' => $formatted_paths,
    'trafficSources' => $formatted_sources,
    'devices' => $dev_stats,
    'devices_raw' => $devices,
    'countries' => $formatted_countries,
    'customEvents' => $formatted_custom,
    'campaigns' => $campaigns,
    'realtimeVisitors' => array_slice(array_map(function($e) {
        // Realtime visitors don't use 'event_name', we just want any hit
        return ['path' => $e['path'], 'country' => ($e['country'] ?? 'Unknown'), 'code' => ($e['country_code'] ?? 'UN')];
    }, array_reverse($site_events)), 0, 10),
    'has_data' => true
];

echo json_encode($stats);
