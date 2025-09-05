<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\MessageModel;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    //Debugging postman
    public function getMessages($message_id)
    {
        return MessageModel::where('message_id', $message_id)->get();
    }


    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'receiver_id' => 'required|integer|exists:users,user_id'
        ]);

        $message = MessageModel::create([
            'message' => $request->message,
            'sender_id' => Auth::user()->user_id,
            'receiver_id' => $request->receiver_id,
            'sent_at' => now(),
        ]);

        //manggil event buat laravel reverb
        broadcast(new MessageSent($message));

        return $message;
    }

    //nampilin user pengirim & last chat ke sidebar
    public function fetchMessages()
    {
        $userId = Auth::user()->user_id;

        $messages = MessageModel::with('sender:user_id,name,avatar')
            ->where(function ($query) use ($userId) {
                $query->where('receiver_id', $userId)
                    ->orWhere('sender_id', $userId);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return $messages->groupBy(function ($msg) use ($userId) {
            return $msg->sender_id == $userId ? $msg->receiver_id : $msg->sender_id;
        })
            ->map(function ($group) use ($userId) {
                $last = $group->sortByDesc('created_at')->first();

                $otherUser = $last->sender_id == $userId
                    ? $last->receiver
                    : $last->sender;

                return [
                    'id' => $otherUser->user_id,
                    'name' => $otherUser->name,
                    'lastMessage' => $last->message,
                    'count' => $group->where('receiver_id', $userId)->where('is_read', false)->count(),
                    'time' => $last->created_at->format('H:i'),
                    'avatar' => $otherUser->avatar ?? 'https://i.pravatar.cc/40?u=' . $otherUser->user_id,
                ];
            })
            ->values();
    }


    public function getAllMessages()
    {
        return response()->json($this->fetchMessages());
    }

    //nampilin detail chat ke dashboard
    public function detailMessage($sender_id)
    {
        $userId = Auth::user()->user_id;

        MessageModel::where(function ($query) use ($sender_id, $userId) {
            $query->where('sender_id', $sender_id)
                ->where('receiver_id', $userId);
        })->update(['is_read' => true, 'read_at' => now()]);

        $messages = MessageModel::with('sender:user_id,name,avatar')
            ->where(function ($query) use ($sender_id, $userId) {
                $query->where('sender_id', $sender_id)
                    ->where('receiver_id', $userId);
            })
            ->orWhere(function ($query) use ($sender_id, $userId) {
                $query->where('sender_id', $userId)
                    ->where('receiver_id', $sender_id);
            })
            ->orderBy('sent_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    //biar kalo receiver sedang diskusi langsung dengan sender, bubble count nggak nambah
    public function markAsRead(Request $request)
    {
        $request->validate([
            'sender_id' => 'required|integer|exists:users,user_id',
        ]);

        $userId = Auth::user()->user_id;

        MessageModel::where('sender_id', $request->sender_id)
            ->where('receiver_id', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json(['status' => 'success']);
    }

    public function privateChat($user_id)
    {
        // Logic for private chat
        return inertia('PrivateChat', [

        ]);
    }

    public function archiveChat($chat_id)
    {
        // Logic for archiving chat
        return inertia('ArchiveChat', [

        ]);
    }
}
