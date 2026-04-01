<?php
/**
 * LEADTENDER — Обработчик формы заявок
 * Принимает POST JSON, валидирует, отправляет email на info@leadtender.ru
 */

// === Настройки ===
$RECIPIENT = 'info@leadtender.ru';
$SUBJECT   = 'Новая заявка с сайта LEADTENDER';
$FROM_NAME = 'LEADTENDER Сайт';
$FROM_MAIL = 'noreply@leadtender.ru';

// === CORS и заголовки ===
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Разрешаем запросы только с нашего домена
$allowed_origins = [
    'https://leadtender.ru',
    'https://www.leadtender.ru',
    'http://leadtender.ru',
    'http://www.leadtender.ru'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// === Только POST ===
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Метод не разрешён']);
    exit;
}

// === Rate limit (не более 5 заявок в минуту с одного IP) ===
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rate_dir = __DIR__ . '/tmp';
if (!is_dir($rate_dir)) {
    mkdir($rate_dir, 0700, true);
}
$rate_file = $rate_dir . '/' . md5($ip) . '.txt';
$now = time();

if (file_exists($rate_file)) {
    $timestamps = array_filter(
        explode("\n", file_get_contents($rate_file)),
        function($t) use ($now) { return $now - intval($t) < 60; }
    );
    if (count($timestamps) >= 5) {
        http_response_code(429);
        echo json_encode(['success' => false, 'error' => 'Слишком много запросов. Попробуйте через минуту.']);
        exit;
    }
    $timestamps[] = $now;
    file_put_contents($rate_file, implode("\n", $timestamps));
} else {
    file_put_contents($rate_file, $now);
}

// === Чтение данных ===
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректные данные']);
    exit;
}

// === Валидация ===
$name    = trim($data['name'] ?? '');
$phone   = trim($data['phone'] ?? '');
$email   = trim($data['email'] ?? '');
$company = trim($data['company'] ?? '');
$message = trim($data['message'] ?? '');

$errors = [];

if (mb_strlen($name) < 2) {
    $errors[] = 'Имя обязательно (минимум 2 символа)';
}

$phone_digits = preg_replace('/\D/', '', $phone);
if (strlen($phone_digits) !== 11) {
    $errors[] = 'Телефон должен содержать 11 цифр';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Некорректный email';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => implode('. ', $errors)]);
    exit;
}

// === Санитизация ===
$name    = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$phone   = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$email   = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$company = htmlspecialchars($company, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// === Формирование письма ===
$date = date('d.m.Y H:i');

$body = "
<html>
<head><meta charset='utf-8'></head>
<body style='font-family: Arial, sans-serif; color: #333;'>
<h2 style='color: #E02020;'>Новая заявка с сайта</h2>
<table style='border-collapse: collapse; width: 100%; max-width: 500px;'>
<tr><td style='padding: 8px 12px; border-bottom: 1px solid #eee; color: #888; width: 130px;'>Имя</td>
    <td style='padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: 600;'>$name</td></tr>
<tr><td style='padding: 8px 12px; border-bottom: 1px solid #eee; color: #888;'>Телефон</td>
    <td style='padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: 600;'><a href='tel:$phone_digits'>$phone</a></td></tr>
<tr><td style='padding: 8px 12px; border-bottom: 1px solid #eee; color: #888;'>Email</td>
    <td style='padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: 600;'><a href='mailto:$email'>$email</a></td></tr>";

if ($company) {
    $body .= "
<tr><td style='padding: 8px 12px; border-bottom: 1px solid #eee; color: #888;'>Компания</td>
    <td style='padding: 8px 12px; border-bottom: 1px solid #eee;'>$company</td></tr>";
}

if ($message) {
    $body .= "
<tr><td style='padding: 8px 12px; border-bottom: 1px solid #eee; color: #888;'>Сообщение</td>
    <td style='padding: 8px 12px; border-bottom: 1px solid #eee;'>$message</td></tr>";
}

$body .= "
<tr><td style='padding: 8px 12px; color: #888;'>Дата</td>
    <td style='padding: 8px 12px; color: #888;'>$date</td></tr>
</table>
<p style='margin-top: 24px; font-size: 12px; color: #aaa;'>Отправлено с сайта leadtender.ru</p>
</body>
</html>";

// === Отправка ===
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=utf-8\r\n";
$headers .= "From: $FROM_NAME <$FROM_MAIL>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";

$sent = mail($RECIPIENT, $SUBJECT, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Ошибка отправки. Попробуйте позже или напишите на info@leadtender.ru']);
}
