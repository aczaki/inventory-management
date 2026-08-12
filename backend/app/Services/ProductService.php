<?php

namespace App\Services;

use App\DTOs\Product\ProductData;
use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    /**
     * Menampilkan daftar produk dengan search, filter, sort, dan pagination.
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        $query = Product::query()
            ->with([
                'category',
                'unit',
                'supplierMasters',
            ]);

        // Search
        if (!empty($filters['search'])) {
            $search = $filters['search'];

            $query->where(function (Builder $builder) use ($search) {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        // Filter Category
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        // Filter Status
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';

        $allowedSort = [
            'name',
            'sku',
            'selling_price',
            'created_at',
        ];

        if (!in_array($sortBy, $allowedSort)) {
            $sortBy = 'created_at';
        }

        $query->orderBy($sortBy, $sortDirection);

        return $query->paginate(
            $filters['per_page'] ?? 10
        );
    }

    /**
     * Menampilkan detail produk.
     */
    public function find(Product $product): Product
    {
        return $product->load([
            'category',
            'unit',
            'supplierMasters',
            'stocks.warehouse',
        ]);
    }

    /**
     * Membuat produk baru.
     */
    public function store(ProductData $data): Product
    {
        return DB::transaction(function () use ($data) {

            $payload = $data->toArray(); 

            if ($data->image) {
                $payload['image'] = $data->image
                    ->store('products', 'public');
            }

            return Product::create($payload);
        });
    }

    /**
     * Update produk.
     */
    public function update(
    Product $product,
    ProductData $data
    ): Product {
        return DB::transaction(function () use ($product, $data) {
            $payload = $data->toArray();

            if ($data->image) {
                if ($product->image) {
                    Storage::disk('public')->delete($product->image);
                }

                $payload['image'] = $data->image
                    ->store('products', 'public');
            }

            $product->update($payload);

            return $product->fresh();
        });
    }

    /**
     * Soft delete.
     */
    public function delete(Product $product): void
    {
        if ($product->image) {
            Storage::disk('public')
                ->delete($product->image);
        }

        $product->delete();
    }

    /**
     * Restore.
     */
    public function restore(int $id): Product
    {
        $product = Product::onlyTrashed()->findOrFail($id);

        $product->restore();

        return $product;
    }

    /**
     * Force delete.
     */
    public function forceDelete(int $id): void
    {
        $product = Product::onlyTrashed()->findOrFail($id);

        if ($product->image) {
            Storage::disk('public')
                ->delete($product->image);
        }

        $product->forceDelete();
    }
}