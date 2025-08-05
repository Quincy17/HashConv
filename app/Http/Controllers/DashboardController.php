<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $messages = app(ChatController::class)->fetchMessages();

        return inertia('Dashboard', [
            'messages' => $messages
        ]);
    }
}
