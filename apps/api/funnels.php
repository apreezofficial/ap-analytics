<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$site_id = $_GET['site_id'] ?? '';
$user_id = $_GET['user_id'] ?? '';
$steps_param = $_GET['steps'] ?? '';

if (!$site_id || !$user_id) { exit(json_encode(['error' => 'Missing ids'])); }

// 1. Ownership & Files
$sites_file = __DIR__ . '/data/sites.json';
$events_file = __DIR__ . '/data/events.json';

if (!file_exists($sites_file)) exit(json_encode(['error' => 'No sites']));
$sites = json_decode(file_get_contents($sites_file), true);
$owned = false;
foreach ($sites as $site) { if ($site['id'] === $site_id && $site['user_id'] === $user_id) { $owned = true; break; } }
if (!$owned) { header("HTTP/1.1 403 Forbidden"); exit(json_encode(['error' => 'Forbidden'])); }

$events = file_exists($events_file) ? json_decode(file_get_contents($events_file), true) : [];
$site_events = array_values(array_filter($events, function($e) use ($site_id) {
    return $e['site_id'] === $site_id;
}));

// Provide available steps if no funnel is queried
if (!$steps_param) {
    $available_paths = [];
    $available_events = [];
    foreach ($site_events as $e) {
        $ev = $e['event_name'] ?? 'page_view';
        if ($ev === 'page_view') {
            $path = $e['path'] ?? '/';
            $available_paths[$path] = ($available_paths[$path] ?? 0) + 1;
        } else {
            $available_events[$ev] = ($available_events[$ev] ?? 0) + 1;
        }
    }
    arsort($available_paths);
    arsort($available_events);
    echo json_encode([
        'paths' => array_keys($available_paths),
        'events' => array_keys($available_events),
        'has_data' => !empty($site_events)
    ]);
    exit;
}

$steps_raw = explode(',', $steps_param);
$steps = [];
foreach ($steps_raw as $sr) {
    if (!$sr) continue;
    $parts = explode('|', $sr);
    if (count($parts) === 2) {
        $steps[] = ['type' => $parts[0], 'value' => $parts[1]]; 
    } else {
        $steps[] = ['type' => 'custom', 'value' => $parts[0]];
    }
}

if (empty($steps)) {
    echo json_encode(['error' => 'No valid steps']); exit;
}

// Group events by IP/Session
$sessions = [];
foreach ($site_events as $e) {
    $ip = $e['ip'] ?? 'unknown';
    if (!isset($sessions[$ip])) $sessions[$ip] = [];
    $sessions[$ip][] = $e;
}

// Funnel logic: sort each session by timestamp, then check maximum step reached in order
$step_counts = array_fill(0, count($steps), 0);

foreach ($sessions as $ip => $session_events) {
    usort($session_events, function($a, $b) { return strtotime($a['timestamp']) <=> strtotime($b['timestamp']); });
    
    $current_step_idx = 0;
    foreach ($session_events as $e) {
        if ($current_step_idx >= count($steps)) break;
        
        $req = $steps[$current_step_idx];
        $ev_name = $e['event_name'] ?? 'page_view';
        $path = $e['path'] ?? '/';
        
        $match = false;
        if ($req['type'] === 'page_view' && $ev_name === 'page_view' && $path === $req['value']) {
            $match = true;
        } else if ($req['type'] === 'custom' && $ev_name === $req['value']) {
            $match = true;
        }
        
        if ($match) {
            $current_step_idx++;
        }
    }
    
    // Add +1 count to all steps leading up to the max reached step matching the exact sequence order
    for ($i = 0; $i < $current_step_idx; $i++) {
        $step_counts[$i]++;
    }
}

// Format Output
$funnel_results = [];
$prev_count = 0;

for ($i = 0; $i < count($steps); $i++) {
    $count = $step_counts[$i];
    $dropoff = 0;
    $conversion = ($i === 0) ? 100 : 0;
    
    if ($i > 0 && $prev_count > 0) {
        $conversion = round(($count / $prev_count) * 100, 1);
        $dropoff = $prev_count - $count;
    }
    
    $funnel_results[] = [
        'step' => $i + 1,
        'name' => $steps[$i]['value'],
        'type' => $steps[$i]['type'],
        'count' => $count,
        'conversion' => $conversion . '%',
        'dropoff' => $dropoff
    ];
    $prev_count = $count;
}

$overall_conv = ($step_counts[0] > 0) ? round((end($step_counts) / $step_counts[0]) * 100, 1) : 0;

echo json_encode([
    'steps' => $funnel_results,
    'overall_conversion' => $overall_conv . '%',
    'total_starts' => $step_counts[0] ?: 0
]);
