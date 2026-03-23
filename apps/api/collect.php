<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$data_dir = __DIR__ . '/data';
$events_file = $data_dir . '/events.json';
$sites_file = $data_dir . '/sites.json';

if (!is_dir($data_dir)) { mkdir($data_dir, 0777, true); }
if (!file_exists($events_file)) { file_put_contents($events_file, json_encode([])); }

function loadData($file) { return file_exists($file) ? json_decode(file_get_contents($file), true) : []; }
function saveData($file, $data) { file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT)); }

$site_id = $_GET['site_id'] ?? ($_GET['projectId'] ?? '');
$path = $_GET['path'] ?? '/';
$referrer = $_GET['referrer'] ?? '';
$user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';

// Handle IP gracefully
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
$ip = explode(',', $ip)[0]; // take the first if there are multiple

// If local, let's grab the actual public IP of the user making the request (by pinging out)
if ($ip === '::1' || strpos($ip, '127.') === 0 || strpos($ip, '192.168.') === 0) {
    try {
        $ip_fetch = @file_get_contents('https://api.ipify.org?format=json');
        if ($ip_fetch) {
            $ip_data = json_decode($ip_fetch, true);
            $ip = $ip_data['ip'] ?? $ip;
        }
    } catch(Exception $e) {}
}

// Get Geo Data
$country = 'Unknown';
$country_code = 'UN';

try {
    // Using ip-api to get real info
    $geo_json = @file_get_contents("http://ip-api.com/json/{$ip}?fields=status,country,countryCode");
    if ($geo_json) {
        $geo = json_decode($geo_json, true);
        if ($geo['status'] === 'success') {
            $country = $geo['country'];
            $country_code = $geo['countryCode'];
        }
    }
} catch (Exception $e) {}

if (!$site_id) {
    echo json_encode(['error' => 'Missing site_id']);
    exit;
}

$sites = loadData($sites_file);
$site_exists = false;
foreach ($sites as $site) { if ($site['id'] === $site_id) { $site_exists = true; break; } }

if (!$site_exists) {
    echo json_encode(['error' => 'Site not found']);
    exit;
}

$device = 'Desktop';
if (preg_match('/Mobi|Android|iPhone/i', $user_agent)) { $device = 'Mobile'; }
elseif (preg_match('/Tablet|iPad/i', $user_agent)) { $device = 'Tablet'; }

// NEW: Event name via parameter (e.g. for custom events tracking)
$event_name = $_GET['event'] ?? 'page_view';

$utm_source = $_GET['utm_source'] ?? '';
$utm_medium = $_GET['utm_medium'] ?? '';
$utm_campaign = $_GET['utm_campaign'] ?? '';

$events = loadData($events_file);
$events[] = [
    'id' => uniqid(),
    'site_id' => $site_id,
    'event_name' => $event_name,
    'path' => $path,
    'referrer' => $referrer ?: 'Direct',
    'timestamp' => date('Y-m-d H:i:s'),
    'country' => $country,
    'country_code' => $country_code,
    'device' => $device,
    'ip' => $ip,
    'ua' => $user_agent,
    'utm_source' => $utm_source,
    'utm_medium' => $utm_medium,
    'utm_campaign' => $utm_campaign
];

saveData($events_file, $events);
echo json_encode(['success' => true]);
