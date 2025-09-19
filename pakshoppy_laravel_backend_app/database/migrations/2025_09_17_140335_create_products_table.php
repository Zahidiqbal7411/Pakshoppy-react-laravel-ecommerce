// database/migrations/xxxx_xx_xx_create_products_table.php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->decimal('price', 10, 2);
            $table->text('description');
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->string('stock_keeping_unit');
            $table->integer('quantity');
            $table->enum('status', ['active', 'inactive']);
            $table->json('images')->nullable(); // store multiple images as JSON array of strings
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
}
?>