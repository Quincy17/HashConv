<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChatController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/messages', [ChatController::class, 'getAllMessages']);
    Route::post('/send-message', [ChatController::class, 'sendMessage'])->name('send.message');
    Route::get('/detail-message/{sender_id}', [ChatController::class, 'detailMessage'])->name('chat.detailMessage');
    Route::post('/mark-as-read', [ChatController::class, 'markAsRead'])->name('chat.markAsRead');

    Route::get('/search-user', [UserController::class, 'searchUser'])->name('user.search');
    Route::get('/private-chat/{user_id}', [ChatController::class, 'privateChat'])->name('chat.privateChat');
    Route::get('/archive-chat/{chat_id}', [ChatController::class, 'archiveChat'])->name('chat.archiveChat');
});

require __DIR__ . '/auth.php';
