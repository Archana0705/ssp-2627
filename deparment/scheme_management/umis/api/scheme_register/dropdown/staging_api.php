<?php

require_once __DIR__ . '/../vendor/autoload.php';

// Load .env file
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        putenv(trim($line));
    }
}

function getPublicIP() {
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        // multiple IPs → first is real client
        $ipList = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ipList[0]);
    } elseif (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } else {
        return $_SERVER['REMOTE_ADDR'];
    }
}

// echo getPublicIP();
use App\Core\Router;
use App\Core\Request;
use App\Controllers\AuthController;
use App\Controllers\CaptchaController;
use App\Controllers\SecureController;
use App\Controllers\UmisController;
use App\Controllers\FiltersController;
use App\Middleware\AuthMiddleware;
use App\Middleware\CSRFMiddleware;
use App\Middleware\RoleMiddleware;
use App\Middleware\RateLimitMiddleware;

$router = new Router();

// Routes
// 0. Health Check (GET)
$router->add('GET', '/api/health', [AuthController::class, 'health'],[
    new RateLimitMiddleware(100, 60) // Higher limit for health check
]);

// 1. Login & Refresh APIs
$router->add('POST', '/api/login', [AuthController::class, 'login'], [
    new RateLimitMiddleware(5, 60) // Strict limit for login
]);
$router->add('POST', '/api/sso-login', [AuthController::class, 'ssoLogin'], [
    new RateLimitMiddleware(10, 60)
]);
$router->add('POST', '/api/refresh', [AuthController::class, 'refresh'], [
    new RateLimitMiddleware(10, 60)
]);

// CAPTCHA endpoints
$router->add('GET', '/api/captcha', [CaptchaController::class, 'generateCaptcha'], [
    new RateLimitMiddleware(10, 60)
]);
$router->add('POST', '/api/captcha/validate', [CaptchaController::class, 'validateCaptcha'], [
    new RateLimitMiddleware(20, 60)
]);

$router->add('GET','/api/getTOKENS', [AuthController::class, 'getTokens'], [
    new RateLimitMiddleware(100, 60)
]);

// 2. Secure API (Auth + CSRF + Role)
$router->add('POST', '/api/secure-data', [SecureController::class, 'getData'], [
    new RateLimitMiddleware(60, 60),
    new AuthMiddleware(),
    new CSRFMiddleware(),
    new RoleMiddleware(['admin'])
]);

$router->add('POST', '/api/get-card', [UmisController::class, 'getCard'], [
    new RateLimitMiddleware(10, 60),
    new AuthMiddleware(),
    new CSRFMiddleware()
]);



// 3. Logout (Auth only)
$router->add('POST', '/api/logout', [AuthController::class, 'logout'], [
    new RateLimitMiddleware(10, 60),
    new AuthMiddleware()
]);


//----------- Filters API  ---------------------- 

$router->add('POST', '/api/department-filter', [FiltersController::class, 'getDepartmentFilter'], [
    new RateLimitMiddleware(30, 60),
    new AuthMiddleware(),
    new CSRFMiddleware()
]);

$router->add('POST', '/api/subdepartment-filter', [FiltersController::class, 'getSubDepartmentFilter'], [
    new RateLimitMiddleware(30, 60),
    new AuthMiddleware(),
    new CSRFMiddleware()
]);









// Dispatch the request
$request = new Request();
$router->dispatch($request);
