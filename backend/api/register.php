<?php
// api/register.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

try {
    include_once '../config/db.php';

    // Pastikan method POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        exit();
    }

    // Ambil data POST
    $json = file_get_contents("php://input");
    $data = json_decode($json);
    
    // Debug: log data yang diterima
    error_log("Received data: " . $json);

    // Validasi input
    if (empty($data->first_name) || empty($data->email) || empty($data->username) || 
        empty($data->password) || empty($data->role)) {
        http_response_code(400);
        echo json_encode(array(
            "message" => "Data tidak lengkap",
            "received" => array(
                "first_name" => isset($data->first_name) ? "OK" : "MISSING",
                "email" => isset($data->email) ? "OK" : "MISSING",
                "username" => isset($data->username) ? "OK" : "MISSING",
                "password" => isset($data->password) ? "OK" : "MISSING",
                "role" => isset($data->role) ? "OK" : "MISSING"
            )
        ));
        exit();
    }

    // Validasi email
    if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(array("message" => "Format email tidak valid"));
        exit();
    }

    // Validasi password minimal 8 karakter
    if (strlen($data->password) < 8) {
        http_response_code(400);
        echo json_encode(array("message" => "Password minimal 8 karakter"));
        exit();
    }

    // Validasi role
    if (!in_array($data->role, ['customer', 'seller'])) {
        http_response_code(400);
        echo json_encode(array("message" => "Role tidak valid: " . $data->role));
        exit();
    }

    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception("Database connection failed");
    }

    // Cek apakah email sudah terdaftar
    $query_check_email = "SELECT id FROM users WHERE email = :email LIMIT 1";
    $stmt_check_email = $db->prepare($query_check_email);
    $stmt_check_email->bindParam(":email", $data->email);
    $stmt_check_email->execute();

    if ($stmt_check_email->rowCount() > 0) {
        http_response_code(409);
        echo json_encode(array("message" => "Email sudah terdaftar"));
        exit();
    }

    // Cek apakah username sudah terdaftar
    $query_check_username = "SELECT id FROM users WHERE username = :username LIMIT 1";
    $stmt_check_username = $db->prepare($query_check_username);
    $stmt_check_username->bindParam(":username", $data->username);
    $stmt_check_username->execute();

    if ($stmt_check_username->rowCount() > 0) {
        http_response_code(409);
        echo json_encode(array("message" => "Username sudah digunakan"));
        exit();
    }

    // Insert user baru
    $query = "INSERT INTO users (first_name, last_name, email, username, phone, password, role) 
              VALUES (:first_name, :last_name, :email, :username, :phone, :password, :role)";

    $stmt = $db->prepare($query);

    // Hash password
    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

    // Bind parameters
    $last_name = isset($data->last_name) ? $data->last_name : '';
    $phone = isset($data->phone) ? $data->phone : '';
    
    $stmt->bindParam(":first_name", $data->first_name);
    $stmt->bindParam(":last_name", $last_name);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":username", $data->username);
    $stmt->bindParam(":phone", $phone);
    $stmt->bindParam(":password", $password_hash);
    $stmt->bindParam(":role", $data->role);

    if ($stmt->execute()) {
        http_response_code(201);
        
        // Ambil data user yang baru dibuat
        $user_id = $db->lastInsertId();
        
        echo json_encode(array(
            "message" => "Registrasi berhasil",
            "user" => array(
                "id" => $user_id,
                "username" => $data->username,
                "email" => $data->email,
                "first_name" => $data->first_name,
                "last_name" => $last_name,
                "role" => $data->role
            )
        ));
    } else {
        http_response_code(500);
        $errorInfo = $stmt->errorInfo();
        echo json_encode(array(
            "message" => "Registrasi gagal",
            "error" => $errorInfo[2]
        ));
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Error: " . $e->getMessage(),
        "trace" => $e->getTraceAsString()
    ));
}
?>