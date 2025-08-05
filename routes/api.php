<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\ChatController;
use App\Models\User;

Route::post('/register-api', function (Request $request) {
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => false,
            'errors' => $validator->errors()
        ], 422);
    }

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'status' => true,
        'message' => 'User registered successfully',
        'user' => $user,
        'token' => $token
    ], 201);
});

Route::post('/login-api', function (Request $request) {
    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $user = User::where('email', $request->email)->first();

    return response()->json([
        'user' => $user,
        'token' => $user->createToken('auth_token')->plainTextToken
    ]);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/messages', [ChatController::class, 'getAllMessages']);
    Route::get('/messages/{message_id}', [ChatController::class, 'getMessages']);
    Route::post('/messages', [ChatController::class, 'sendMessage']);
});

Route::get('/test', function (Request $request) {
    return response()->json([
        'message' => 'API Berhasil!'
    ]);
});

Route::get('/farrel', function (Request $request) {
    return response()->json([
        'message' => 'Farrel Caesarian'
    ]);
});
