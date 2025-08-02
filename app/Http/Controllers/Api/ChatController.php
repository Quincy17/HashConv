<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MessageModel;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function getMessages($message_id)
    {
        return MessageModel::where('message_id', $message_id)->get();
    }

    public function sendMessage(Request $request)
    {
        $message = MessageModel::create([
            'message' => $request->message,
            'sender_id' => Auth::user()->user_id,
            'receiver_id' => $request->receiver_id,
            'sent_at' => now(),
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return $message;
    }
}
