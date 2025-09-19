<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\VerificationController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Api\ProductController;



// 🔓 Public routes (No auth required)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ✅ Verification that can be done publicly
Route::get('/email/verify', [VerificationController::class, 'verifyEmail']);   // Email via token
Route::post('/phone/verify-otp', [VerificationController::class, 'verifyPhoneOtp']); // OTP via input

// 🔐 Protected routes (Require Bearer token using auth:sanctum)
Route::middleware(['auth:sanctum'])->group(function () {
    // Auth user info & logout
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    
    
    Route::post('/contacts', [ContactController::class, 'store']);
    Route::post('/email/send-verification', [VerificationController::class, 'sendEmailVerification']);
    Route::post('/phone/send-otp', [VerificationController::class, 'sendPhoneOtp']);

       Route::get('/products', [ProductController::class, 'index']);   
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{id}', [ProductController::class, 'show']); // Get single product
    Route::put('/products/{id}', [ProductController::class, 'update']);
     Route::delete('/products/{id}', [ProductController::class, 'destroy']); // Update product
   

});

