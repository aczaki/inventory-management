<?php

namespace App\Services;

use App\DTOs\Supplier\SupplierData;
use App\Models\Supplier;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class SupplierService
{
    public function paginate(array $filters): LengthAwarePaginator
    {
        $query = Supplier::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];

            $query->where(function (Builder $builder) use ($search) {
                $builder
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere(
                        'contact_person',
                        'like',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'email',
                        'like',
                        "%{$search}%"
                    );
            });
        }

        if (isset($filters['status'])) {
            $query->where(
                'status',
                $filters['status']
            );
        }

        $sortBy = $filters['sort_by'] ?? 'created_at';

        $sortDirection = strtolower(
            $filters['sort_direction'] ?? 'desc'
        );

        $allowedSort = [
            'code',
            'name',
            'status',
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

    public function find(Supplier $supplier): Supplier
    {
        return $supplier->loadCount('products');
    }

    public function store(SupplierData $data): Supplier
    {
        return DB::transaction(function () use ($data) {
            return Supplier::create(
                $data->toArray()
            );
        });
    }

    public function update(
        Supplier $supplier,
        SupplierData $data
    ): Supplier {
        return DB::transaction(function () use (
            $supplier,
            $data
        ) {
            $supplier->update(
                $data->toArray()
            );

            return $supplier->fresh();
        });
    }

    public function delete(Supplier $supplier): void
    {
        $supplier->delete();
    }

    public function restore(int $id): Supplier
    {
        $supplier = Supplier::onlyTrashed()
            ->findOrFail($id);

        $supplier->restore();

        return $supplier->fresh();
    }
}