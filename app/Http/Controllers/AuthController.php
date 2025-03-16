<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class AuthController
{
    public function login()
    {
        $credentials = request()->only('email', 'password');
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            request()->session()->regenerate();

            return response()->json(['user' => $user]);
        }

        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    public function logout()
    {
        Auth::guard('web')->logout();

        request()->session()->invalidate();

        return response()->json(['message' => 'Logged out']);
    }
}
