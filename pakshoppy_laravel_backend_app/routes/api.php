<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\VerificationController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\API\ProductController;

// 🔓 Public routes (No auth required)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ✅ Verification that can be done publicly
Route::get('/email/verify', [VerificationController::class, 'verifyEmail']);
Route::post('/phone/verify-otp', [VerificationController::class, 'verifyPhoneOtp']);

// 🔐 Protected routes (Require Bearer token using auth:sanctum)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/contacts', [ContactController::class, 'store']);
    Route::post('/email/send-verification', [VerificationController::class, 'sendEmailVerification']);
    Route::post('/phone/send-otp', [VerificationController::class, 'sendPhoneOtp']);

    Route::apiResource('products', ProductController::class);
});
