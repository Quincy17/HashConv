<?php

namespace App\Events;

use App\Models\MessageModel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class MessageSent implements ShouldBroadcastNow
{
    use InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(MessageModel $message)
    {
        $this->message = $message->load('sender', 'receiver');
    }

    public function broadcastOn()
    {
        Log::info("sip kekirim", $this->message->toArray()); //Debugging
        return new PrivateChannel('chat.' . $this->message->receiver_id);
    }
}
