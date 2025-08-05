<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\MessageModel;


Broadcast::channel('chat.{receiverId}', function ($user, $receiverId) {
    // cek apakah receiver atau sender yang pernah ngirim chat ke receiver
    return (int) $user->user_id === (int) $receiverId
        || MessageModel::where(function ($q) use ($user, $receiverId) {
            $q->where('sender_id', $user->user_id)
                ->where('receiver_id', $receiverId);
        })
        ->orWhere(function ($q) use ($user, $receiverId) {
            $q->where('sender_id', $receiverId)
                ->where('receiver_id', $user->user_id);
        })
        ->exists();
});
