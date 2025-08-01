<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupMemberModel extends Model
{
    protected $table = 'group_member';
    protected $primaryKey = 'member_id';

    protected $fillable = [
        'user_id',
        'group_chat_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function groupChat()
    {
        return $this->belongsTo(GroupChatModel::class, 'group_chat_id', 'group_chat_id');
    }
}
