<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('group_chat', function (Blueprint $table) {
            $table->id('group_chat_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('owner_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->boolean('is_private')->default(false);
            $table->timestamps();
        });

        Schema::create('group_member', function (Blueprint $table) {
            $table->id('member_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('group_chat_id');

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('group_chat_id')->references('group_chat_id')->on('group_chat')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('group_member');
        Schema::dropIfExists('group_chat');
    }
};
