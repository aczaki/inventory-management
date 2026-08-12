<?php

namespace App\Services;

use App\DTOs\Category\CategoryData;
use App\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class CategoryService
{
    public function paginate(array $filters): LengthAwarePaginator
    {
        $query = Category::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];

            $query->where(function (Builder $builder) use ($search) {
                $builder
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if (isset($filters['parent_id'])) {
            if ($filters['parent_id'] === 'null') {
                $query->whereNull('parent_id');
            } else {
                $query->where(
                    'parent_id',
                    $filters['parent_id']
                );
            }
        }

        $sortBy = $filters['sort_by'] ?? 'created_at';

        $sortDirection = strtolower(
            $filters['sort_direction'] ?? 'desc'
        );

        $allowedSort = [
            'name',
            'slug',
            'created_at',
        ];

        if (!in_array($sortBy, $allowedSort)) {
            $sortBy = 'created_at';
        }

        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }

        return $query
            ->orderBy($sortBy, $sortDirection)
            ->paginate($filters['per_page'] ?? 10);
    }

    public function find(Category $category): Category
    {
        return $category->loadCount('products');
    }

    public function store(CategoryData $data): Category
    {
        return DB::transaction(function () use ($data) {
            return Category::create(
                $data->toArray()
            );
        });
    }

    public function update(
        Category $category,
        CategoryData $data
    ): Category {
        return DB::transaction(function () use (
            $category,
            $data
        ) {
            $category->update(
                $data->toArray()
            );

            return $category->fresh();
        });
    }

    public function delete(Category $category): void
    {
        $category->delete();
    }

    public function restore(int $id): Category
    {
        $category = Category::onlyTrashed()
            ->findOrFail($id);

        $category->restore();

        return $category;
    }
}