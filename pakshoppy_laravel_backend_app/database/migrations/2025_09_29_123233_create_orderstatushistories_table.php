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
        Schema::create('orderstatushistories', function (Blueprint $table) {
            $table->id();
           
            $table->enum('status', ['pending', 'processing', 'completed', 'cancelled', 'refunded', 'failed', 'delivered']);
            $table->text('comments')->nullable();
            $table->foreignId('order_id')->references('id')->on('orders')->onDelete('cascade');
            
            $table->foreignId('changed_by')->references('id')->on('users')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orderstatushistories');
    }
};
