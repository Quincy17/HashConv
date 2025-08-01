<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id('message_id');
            $table->longText('message');

            $table->foreignId('sender_id')
                ->constrained('users', 'user_id')
                ->onDelete('cascade');

            $table->foreignId('receiver_id')
                ->nullable()
                ->constrained('users', 'user_id')
                ->onDelete('cascade');

            $table->foreignId('group_chat_id')
                ->nullable()
                ->constrained('group_chat', 'group_chat_id')
                ->onDelete('cascade');

            $table->foreignId('conversation_id')
                ->nullable()
                ->constrained('conversation', 'conversation_id')
                ->onDelete('cascade');

            $table->timestamp('sent_at')->useCurrent();
            $table->timestamp('read_at')->nullable();
            $table->boolean('is_read')->default(false);

            $table->timestamps();
        });

        // Alter conversation
        Schema::table('conversation', function (Blueprint $table) {
            $table->foreignId('last_message_id')
                ->nullable()
                ->constrained('messages', 'message_id')
                ->nullOnDelete();
        });

        // Alter group_chat
        Schema::table('group_chat', function (Blueprint $table) {
            $table->foreignId('last_message_id')
                ->nullable()
                ->constrained('messages', 'message_id')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
