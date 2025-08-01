<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageModel extends Model
{
    protected $table = 'messages';
    protected $primaryKey = 'message_id';
    protected $fillable = [
        'message',
        'sender_id',
        'receiver_id',
        'group_chat_id',
        'conversation_id',
        'sent_at',
        'read_at',
        'is_read',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id', 'user_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id', 'user_id');
    }

    public function attachments()
    {
        return $this->hasMany(MessageAttachment::class, 'message_id', 'message_id');
    }
}
