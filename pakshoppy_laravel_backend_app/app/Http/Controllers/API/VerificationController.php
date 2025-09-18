<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\User;

class VerificationController extends Controller
{
    // 🔹 Send email verification token to logged-in user
    public function sendEmailVerification(Request $request)
    {
        $user = $request->user();

        if ($user->is_email_verified) {
            return response()->json(['message' => 'Email already verified'], 200);
        }

        $token = Str::random(40);
        $user->email_verification_token = $token;
        $user->save();

        // Simulate sending email — in real app, use Mail::to($user)->send(new VerifyEmail($token));
        \Log::info("Email verification token for {$user->email}: $token");

        return response()->json(['message' => 'Verification email sent. Check logs for token.'], 200);
    }

    // 🔹 Verify email via token
    public function verifyEmail(Request $request)
    {
        $token = $request->query('token');

        $user = User::where('email_verification_token', $token)->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired token'], 400);
        }

        $user->is_email_verified = true;
        $user->email_verification_token = null;
        $user->save();

        return response()->json(['message' => 'Email verified successfully'], 200);
    }

    // 🔹 Send OTP to user's phone
    public function sendPhoneOtp(Request $request)
    {
        $user = $request->user();

        if ($user->is_phone_verified) {
            return response()->json(['message' => 'Phone number already verified'], 200);
        }

        $otp = rand(100000, 999999);
        $user->phone_otp = $otp;
        $user->otp_expires_at = Carbon::now()->addMinutes(5);
        $user->save();

        // Simulate SMS send
        \Log::info("OTP for {$user->phone}: $otp");

        return response()->json(['message' => 'OTP sent successfully. Check logs.'], 200);
    }

    // 🔹 Verify phone OTP
    public function verifyPhoneOtp(Request $request)
    {
        $request->validate([
            'otp' => 'required|digits:6',
        ]);

        $user = $request->user();

        if (!$user->phone_otp || !$user->otp_expires_at || Carbon::now()->gt($user->otp_expires_at)) {
            return response()->json(['message' => 'OTP expired or not found'], 400);
        }

        if ($request->otp != $user->phone_otp) {
            return response()->json(['message' => 'Invalid OTP'], 400);
        }

        $user->is_phone_verified = true;
        $user->phone_otp = null;
        $user->otp_expires_at = null;
        $user->save();

        return response()->json(['message' => 'Phone verified successfully'], 200);
    }
}
