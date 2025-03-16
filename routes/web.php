<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PageController;

//Route::permanentRedirect('/', '/login');

Route::get('/', PageController::class);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

//Route::middleware('auth:sanctum')->group(function () {
//});

// require __DIR__.'/auth.php';
