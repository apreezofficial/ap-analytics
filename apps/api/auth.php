<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$db_file = __DIR__ . '/data/users.json';

// Ensure data directory exists
if (!is_dir(__DIR__ . '/data')) {
    mkdir(__DIR__ . '/data', 0777, true);
}

// Initialize DB if not exists
if (!file_exists($db_file)) {
    file_put_contents($db_file, json_encode([]));
}

function loadUsers() {
    global $db_file;
    return json_decode(file_get_contents($db_file), true);
}

function saveUsers($users) {
    global $db_file;
    file_put_contents($db_file, json_encode($users, JSON_PRETTY_PRINT));
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? '';

if ($action === 'signup') {
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (!$email || !$password) {
        echo json_encode(['error' => 'Missing email or password']);
        exit;
    }

    $users = loadUsers();
    foreach ($users as $user) {
        if ($user['email'] === $email) {
            echo json_encode(['error' => 'User already exists']);
            exit;
        }
    }

    $users[] = [
        'id' => uniqid(),
        'email' => $email,
        'password' => password_hash($password, PASSWORD_DEFAULT),
        'created_at' => date('Y-m-d H:i:s')
    ];

    saveUsers($users);
    echo json_encode(['success' => true, 'message' => 'Account created successfully']);
    exit;
}

if ($action === 'signin') {
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (!$email || !$password) {
        echo json_encode(['error' => 'Missing email or password']);
        exit;
    }

    $users = loadUsers();
    foreach ($users as $user) {
        if ($user['email'] === $email) {
            if (password_verify($password, $user['password'])) {
                echo json_encode([
                    'success' => true, 
                    'user' => [
                        'id' => $user['id'],
                        'email' => $user['email']
                    ]
                ]);
                exit;
            } else {
                echo json_encode(['error' => 'Invalid password']);
                exit;
            }
        }
    }

    echo json_encode(['error' => 'User not found']);
    exit;
}

echo json_encode(['error' => 'Invalid action']);
