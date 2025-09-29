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
    Schema::create('orders', function (Blueprint $table) {
        $table->id();

        // Correct way to restrict values
        $table->enum('status', ['pending', 'processing', 'completed', 'cancelled', 'refunded', 'failed', 'delivered']);

        $table->unsignedBigInteger('user_id');
        $table->decimal('total_amount', 10, 2);

        $table->enum('payment_method', ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery']);
        $table->enum('payment_status', ['pending', 'completed', 'failed', 'refunded']);

        $table->string('shipping_address');
        $table->string('billing_address');

        $table->dateTime('order_date');
        $table->dateTime('shipped_date')->nullable();
        $table->dateTime('delivery_date')->nullable();

        $table->text('notes')->nullable();

        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
