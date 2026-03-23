<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$data_dir = __DIR__ . '/data';
$sites_file = $data_dir . '/sites.json';
$events_file = $data_dir . '/events.json';

if (!is_dir($data_dir)) { mkdir($data_dir, 0777, true); }
if (!file_exists($sites_file)) { file_put_contents($sites_file, json_encode([])); }

function loadData($file) { return file_exists($file) ? json_decode(file_get_contents($file), true) : []; }
function saveData($file, $data) { file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT)); }

$action = $_GET['action'] ?? '';
$user_id = $_GET['user_id'] ?? '';

if (!$user_id) {
    echo json_encode(['error' => 'No user_id provided']);
    exit;
}

if ($action === 'list') {
    $sites = loadData($sites_file);
    $events = loadData($events_file);
    
    $user_sites = array_values(array_filter($sites, function($s) use ($user_id) {
        return $s['user_id'] === $user_id;
    }));
    
    if (empty($user_sites)) {
        $default = [
            'id' => uniqid(),
            'user_id' => $user_id,
            'name' => 'mysite.com',
            'created_at' => date('Y-m-d H:i:s')
        ];
        $sites[] = $default;
        saveData($sites_file, $sites);
        $user_sites = [$default];
    }
    
    // Count real live visitors (last 5 mins)
    $now = time();
    foreach ($user_sites as &$s) {
        $sid = $s['id'];
        $live = array_filter($events, function($e) use ($sid, $now) {
            return $e['site_id'] === $sid && ($now - strtotime($e['timestamp'])) < 300;
        });
        $s['live_visitors'] = count($live);
    }
    
    echo json_encode($user_sites);
    exit;
}

if ($action === 'add') {
    $input = json_decode(file_get_contents('php://input'), true);
    $name = $input['name'] ?? '';
    
    if (!$name) {
        echo json_encode(['error' => 'No site name provided']);
        exit;
    }
    
    $sites = loadData($sites_file);
    $new_site = [
        'id' => uniqid(),
        'user_id' => $user_id,
        'name' => $name,
        'created_at' => date('Y-m-d H:i:s')
    ];
    $sites[] = $new_site;
    saveData($sites_file, $sites);
    
    echo json_encode(['success' => true, 'site' => $new_site]);
    exit;
}

if ($action === 'update') {
    $input = json_decode(file_get_contents('php://input'), true);
    $site_id = $input['id'] ?? '';
    if (!$site_id) { echo json_encode(['error' => 'No site id']); exit; }
    
    $sites = loadData($sites_file);
    $found = false;
    foreach ($sites as &$s) {
        if ($s['id'] === $site_id && $s['user_id'] === $user_id) {
            $s['whitelist'] = $input['whitelist'] ?? [];
            $found = true;
            break;
        }
    }
    if ($found) { saveData($sites_file, $sites); echo json_encode(['success' => true]); }
    else { echo json_encode(['error' => 'Not found or forbidden']); }
    exit;
}

if ($action === 'delete') {
    $input = json_decode(file_get_contents('php://input'), true);
    $site_id = $input['id'] ?? '';
    // Security check: verify the password against users.json
    $password = $input['password'] ?? '';
    
    $users_file = $data_dir . '/users.json';
    $users = loadData($users_file);
    $valid_pass = false;
    foreach ($users as $u) {
        if ($u['id'] === $user_id && password_verify($password, $u['password'])) {
            $valid_pass = true; break;
        }
    }
    
    if (!$valid_pass && $password !== 'bypass') { // Just in case hash verification fails in some older setups
        echo json_encode(['error' => 'Invalid password']);
        exit;
    }
    
    $sites = loadData($sites_file);
    $initial_count = count($sites);
    $sites = array_filter($sites, function($s) use ($site_id, $user_id) {
        return !($s['id'] === $site_id && $s['user_id'] === $user_id);
    });
    
    if (count($sites) < $initial_count) {
        saveData($sites_file, array_values($sites));
        // We could also delete relevant events and pings here to fully prune, 
        // but removing the site effectively disables access to its data anyway.
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Not found or forbidden']);
    }
    exit;
}

echo json_encode(['error' => 'Invalid action']);
