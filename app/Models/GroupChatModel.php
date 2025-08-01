<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupChatModel extends Model
{
    protected $table = 'group_chat';
    protected $primaryKey = 'group_chat_id';

    protected $fillable = [
        'name',
        'description',
        'owner_id',
        'last_message_id',
        'created_at',
        'updated_at',
    ];

    public function members()
    {
        return $this->belongsToMany(User::class, 'group_member', 'group_chat_id', 'user_id')
            ->withTimestamps();
    }

    public function messages()
    {
        return $this->hasMany(MessageModel::class, 'group_chat_id', 'group_chat_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class);
    }
}
