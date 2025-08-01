<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageAttachment extends Model
{
    protected $table = 'message_attachments';
    protected $primaryKey = 'attachment_id';

    protected $fillable = [
        'message_id',
        'file_name',
        'file_path',
        'file_mime',
        'file_size',
    ];

    public function message()
    {
        return $this->belongsTo(MessageModel::class, 'message_id', 'message_id');
    }
}
