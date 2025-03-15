<?php

use App\Http\Controllers\Api\StateController;

Route::permanentRedirect('/', '/login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/state', [StateController::class, 'get']);
    Route::post('/state', [StateController::class, 'set']);
});

require __DIR__.'/auth.php';
