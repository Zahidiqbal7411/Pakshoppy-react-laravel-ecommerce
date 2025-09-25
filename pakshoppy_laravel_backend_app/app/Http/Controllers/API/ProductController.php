<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('images')->get();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products',
            'price' => 'required|numeric',
            'description' => 'required|string',
            'discount_price' => 'nullable|numeric',
            'stock_keeping_unit' => 'required|string|max:255',
            'quantity' => 'required|integer',
            'status' => 'required|in:active,inactive',
            'product_images' => 'required|array|min:1',
            'product_images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::create($request->only([
            'name', 'slug', 'price', 'description', 'discount_price', 'stock_keeping_unit', 'quantity', 'status'
        ]));

        $uploadDir = public_path('products');
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        foreach ($request->file('product_images') as $image) {
            $ext = $image->getClientOriginalExtension();
            $filename = time() . '_' . uniqid() . '.' . $ext;
            $image->move($uploadDir, $filename);
            $pathInDb = 'products/' . $filename;

            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $pathInDb,
            ]);
        }

        $productWithImages = Product::with('images')->find($product->id);
        return response()->json($productWithImages, 201);
    }

    public function show($id)
    {
        $product = Product::with('images')->find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        return response()->json($product);
    }

    public function update(Request $request, $id)
{
    $product = Product::with('images')->find($id);
    if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
    }

    $validator = Validator::make($request->all(), [
        'name' => 'sometimes|required|string|max:255',
        'slug' => 'sometimes|required|string|max:255|unique:products,slug,' . $product->id,
        'price' => 'sometimes|required|numeric',
        'description' => 'nullable|string',
        'discount_price' => 'nullable|numeric',
        'stock_keeping_unit' => 'sometimes|required|string|max:255',
        'quantity' => 'sometimes|required|integer',
        'status' => 'sometimes|required|in:active,inactive',
        'product_images' => 'sometimes|array',
        'product_images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        'delete_image_ids' => 'sometimes|string', // JSON string of IDs to delete
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // Update product fields
    $product->update($request->only([
        'name', 'slug', 'price', 'description',
        'discount_price', 'stock_keeping_unit',
        'quantity', 'status',
    ]));

    // Handle deleting images
    if ($request->has('delete_image_ids')) {
        $idsToDelete = json_decode($request->input('delete_image_ids'), true);
        if (is_array($idsToDelete)) {
            $imagesToDelete = ProductImage::whereIn('id', $idsToDelete)->where('product_id', $product->id)->get();
            foreach ($imagesToDelete as $image) {
                $filePath = public_path($image->image_path);
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
                $image->delete();
            }
        }
    }

    // Handle new image uploads
    if ($request->hasFile('product_images')) {
        $uploadDir = public_path('products');
        if (!file_exists($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
                throw new \Exception("Could not create upload directory: {$uploadDir}");
            }
        }
        if (!is_writable($uploadDir)) {
            throw new \Exception("Upload directory is not writable: {$uploadDir}");
        }

        foreach ($request->file('product_images') as $image) {
            if (!$image->isValid()) {
                continue;
            }
            $ext = $image->getClientOriginalExtension();
            $filename = time() . '_' . uniqid() . '.' . $ext;

            $image->move($uploadDir, $filename);
            $pathInDb = 'products/' . $filename;

            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $pathInDb,
            ]);
        }
    }

    $productWithImages = Product::with('images')->find($product->id);

    return response()->json($productWithImages);
}

   public function destroy($id)
{
    $product = Product::findOrFail($id);
 

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
