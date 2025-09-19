<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // List all products
    public function index()
    {
        $products = Product::with('images')->get();
        return response()->json($products);
    }

    // Store new product
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'slug' => 'required|string|unique:products',
            'price' => 'required|numeric',
            'description' => 'required|string',
            'discount_price' => 'nullable|numeric',
            'stock_keeping_unit' => 'required|string',
            'quantity' => 'required|integer',
            'status' => 'required|in:active,inactive',
            'product_images' => 'required|array',
            'product_images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $product = Product::create($request->only([
            'name',
            'slug',
            'price',
            'description',
            'discount_price',
            'stock_keeping_unit',
            'quantity',
            'status',
        ]));

        // Save images
        if ($request->hasFile('product_images')) {
            foreach ($request->file('product_images') as $image) {
                $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('products'), $filename);

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => 'products/' . $filename,
                ]);
            }
        }

        $product->load('images');

        return response()->json($product, 201);
    }

    // Show single product
    public function show($id)
    {
        $product = Product::with('images')->find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product);
    }

    // Update product (optional)
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'description' => 'nullable|string',
        ]);

        $product->update($request->all());

        return response()->json($product);
    }

    // Delete product
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Delete associated images files
        foreach ($product->images as $img) {
            $file_path = public_path($img->image_path);
            if (file_exists($file_path)) {
                unlink($file_path);
            }
            $img->delete();
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
