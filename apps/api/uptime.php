<?php
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$site_id = $_GET['site_id'] ?? '';
$user_id = $_GET['user_id'] ?? '';

if (!$site_id || !$user_id) { exit(json_encode(['error' => 'Missing ids'])); }

$data_dir = __DIR__ . '/data';
$sites_file = $data_dir . '/sites.json';
$pings_file = $data_dir . '/pings.json';

if (!file_exists($sites_file)) exit(json_encode(['error' => 'No sites']));
$sites = json_decode(file_get_contents($sites_file), true);

$target_site = null;
foreach ($sites as $site) { 
    if ($site['id'] === $site_id && $site['user_id'] === $user_id) { 
        $target_site = $site; 
        break; 
    } 
}
if (!$target_site) { header("HTTP/1.1 403 Forbidden"); exit(json_encode(['error' => 'Forbidden'])); }

// Load existing pings
if (!file_exists($pings_file)) { file_put_contents($pings_file, json_encode([])); }
$pings = json_decode(file_get_contents($pings_file), true);
if (!isset($pings[$site_id])) $pings[$site_id] = [];

// Determine real URL to ping
$domain = strtolower(trim($target_site['name']));
if (strpos($domain, 'http') !== 0) {
    // If testing locally (localhost, default test domains), attempt http, else https
    if (strpos($domain, 'localhost') !== false || strpos($domain, '.test') !== false) {
        $url = "http://" . $domain;
    } else {
        $url = "https://" . $domain;
    }
} else {
    $url = $domain;
}

// Perform REAL ping using cURL
$start_time = microtime(true);
$http_code = 0;

if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // Vercel and many modern CDNs block HEAD requests with a 405 or 403, we must use GET
    curl_setopt($ch, CURLOPT_HTTPGET, true);
    // Use a standard browser UA to bypass basic WAF blocks
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
}

// Fallback if cURL completely fails or is disabled
if ($http_code == 0) {
    try {
        $ctx = stream_context_create(['http'=>['timeout'=>10,'user_agent'=>'Mozilla/5.0...'],'ssl'=>['verify_peer'=>false,'verify_peer_name'=>false]]);
        $hdrs = @get_headers($url, 1, $ctx);
        if ($hdrs && isset($hdrs[0])) {
            preg_match('/HTTP\/.*\s(\d{3})/', $hdrs[0], $match);
            if(isset($match[1])) $http_code = intval($match[1]);
        }
    } catch(Exception $e){}
}

$end_time = microtime(true);

$latency = round(($end_time - $start_time) * 1000); // ms
$is_up = ($http_code >= 200 && $http_code < 400);

// Record this fresh ping
$now = time();
$new_ping = [
    'ts' => $now,
    'code' => $http_code,
    'latency' => $latency,
    'up' => $is_up
];
$pings[$site_id][] = $new_ping;

// Prune old pings (keep only last 1000 pings for this site to prevent bloat)
if (count($pings[$site_id]) > 1000) {
    $pings[$site_id] = array_slice($pings[$site_id], -1000);
}
file_put_contents($pings_file, json_encode($pings));

// Calculate 30-day blocks
// First, fill 30 days of empty states
$daily_stats = [];
for ($i = 29; $i >= 0; $i--) {
    $d = date('Y-m-d', $now - ($i * 86400));
    $daily_stats[$d] = ['checks' => 0, 'up' => 0, 'latencies' => []];
}

// Aggregate historical pings
$recent_latencies = []; // last few pings for the chart
foreach ($pings[$site_id] as $p) {
    $d = date('Y-m-d', $p['ts']);
    if (isset($daily_stats[$d])) {
        $daily_stats[$d]['checks']++;
        if ($p['up']) $daily_stats[$d]['up']++;
        $daily_stats[$d]['latencies'][] = $p['latency'];
    }
    // gather recent 30 pings regardless of day
    $recent_latencies[] = ['ts' => date('H:i:s', $p['ts']), 'val' => $p['latency']];
}

$history_blocks = [];
$total_checks = 0;
$total_ups = 0;
$total_latency = 0;
$total_latency_count = 0;

foreach ($daily_stats as $date => $stat) {
    if ($stat['checks'] == 0) {
        $history_blocks[] = ['date' => $date, 'uptime' => null, 'status' => 'no_data'];
    } else {
        $up_pct = round(($stat['up'] / $stat['checks']) * 100, 2);
        $total_checks += $stat['checks'];
        $total_ups += $stat['up'];
        
        foreach ($stat['latencies'] as $l) {
            $total_latency += $l;
            $total_latency_count++;
        }
        
        $history_blocks[] = ['date' => $date, 'uptime' => $up_pct, 'status' => ($up_pct == 100 ? 'perfect' : ($up_pct > 95 ? 'degraded' : 'down'))];
    }
}

$overall_uptime = $total_checks > 0 ? round(($total_ups / $total_checks) * 100, 2) : 100;
$avg_latency = $total_latency_count > 0 ? round($total_latency / $total_latency_count) : 0;
$recent = array_slice($recent_latencies, -30);

echo json_encode([
    'target_url' => $url,
    'live_status' => $is_up ? 'Operational' : 'Down',
    'live_code' => $http_code,
    'overall_uptime' => $overall_uptime,
    'avg_latency' => $avg_latency,
    'history' => $history_blocks,
    'chart_labels' => array_column($recent, 'ts'),
    'chart_data' => array_column($recent, 'val')
]);
