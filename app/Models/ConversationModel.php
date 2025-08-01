<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConversationModel extends Model
{
    protected $table = 'conversation';
    protected $primaryKey = 'conversation_id';

    protected $fillable = [
        'user_id1',
        'user_id2',
        'last_message_id',
    ];

    public function user1()
    {
        return $this->belongsTo(User::class, 'user_id1', 'user_id');
    }

    public function user2()
    {
        return $this->belongsTo(User::class, 'user_id2', 'user_id');
    }

    public function lastMessage()
    {
        return $this->belongsTo(MessageModel::class, 'last_message_id', 'message_id');
    }
}
