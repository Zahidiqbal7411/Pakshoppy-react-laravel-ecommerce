<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;






use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('images')->get();
        return response()->json($products);
    }

      public function store(Request $request)
    {
        try {
            Log::info('STORE_START: Received product create request', [
                'input_except_files' => $request->except('product_images'),
                'hasFiles' => $request->hasFile('product_images'),
            ]);

            // Validation
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
                Log::warning('STORE_VALIDATION_FAILED', $validator->errors()->toArray());
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Create the product
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

            // Decide whether to use public_path or Storage
            // Here I'll show both options (you can pick one)

            // Option A: using public/products via move()
            $uploadDir = public_path('products');
            if (!file_exists($uploadDir)) {
                if (!mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
                    throw new \Exception("Could not create upload directory: {$uploadDir}");
                }
            }
            if (!is_writable($uploadDir)) {
                throw new \Exception("Upload directory is not writable: {$uploadDir}");
            }

            // Process each image
            $savedImages = [];
            foreach ($request->file('product_images') as $image) {
                if (!$image->isValid()) {
                    Log::error("STORE_ERROR: One of the uploaded images is invalid", ['error' => $image->getErrorMessage() ?? 'unknown']);
                    continue;
                }

                $ext = $image->getClientOriginalExtension();
                $filename = time() . '_' . uniqid() . '.' . $ext;
                
                // Move file
                // Option A:
                $image->move($uploadDir, $filename);
                $pathInDb = 'products/' . $filename;

                // Option B (alternative) using Storage (if you want to store in storage/app/public/products)
                // $pathInDb = $image->storeAs('products', $filename, 'public'); 
                // (If using this, ensure you have run php artisan storage:link)

                // Save in database
                $pi = ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $pathInDb,
                ]);
                $savedImages[] = $pi;
                Log::info("STORE_IMAGE_SAVED", [
                    'filename' => $filename,
                    'path' => $pathInDb,
                    'product_id' => $product->id,
                ]);
            }

            // Load product with images
            $productWithImages = Product::with('images')->find($product->id);

            Log::info('STORE_SUCCESS: Product and images saved', ['product_id' => $product->id, 'images_count' => count($savedImages)]);

            return response()->json($productWithImages, 201);

        } catch (\Throwable $e) {
            Log::error('STORE_EXCEPTION', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'error' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
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
        $product = Product::find($id);
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
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product->update($request->only([
            'name', 'slug', 'price', 'description',
            'discount_price', 'stock_keeping_unit',
            'quantity', 'status',
        ]));

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::with('images')->find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Delete image files
        foreach ($product->image_path as $img) {
            $filePath = public_path($img->image_path);
            if (file_exists($filePath)) {
                unlink($filePath);
            }
            $img->delete();
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
