<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name', 'slug', 'price', 'description', 'discount_price',
        'stock_keeping_unit', 'quantity', 'status',
    ];

    // Define relation for images
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
}
