<?php

namespace App\Http\Controllers\Api;

use App\Actions\Supplier\CreateSupplierAction;
use App\Actions\Supplier\DeleteSupplierAction;
use App\Actions\Supplier\RestoreSupplierAction;
use App\Actions\Supplier\UpdateSupplierAction;
use App\DTOs\Supplier\SupplierData;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Http\Resources\SupplierResource;
use App\Models\Supplier;
use App\Services\SupplierService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function __construct(
        protected SupplierService $supplierService,
        protected CreateSupplierAction $createSupplierAction,
        protected UpdateSupplierAction $updateSupplierAction,
        protected DeleteSupplierAction $deleteSupplierAction,
        protected RestoreSupplierAction $restoreSupplierAction,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $suppliers = $this->supplierService->paginate(
            $request->only([
                'search',
                'status',
                'sort_by',
                'sort_direction',
                'per_page',
            ])
        );

        return ApiResponse::success(
            SupplierResource::collection($suppliers),
            'Suppliers retrieved successfully.'
        );
    }

    public function store(
        StoreSupplierRequest $request
    ): JsonResponse {
        $data = SupplierData::fromRequest($request);

        $supplier = $this->createSupplierAction
            ->execute($data);

        return ApiResponse::success(
            SupplierResource::make($supplier),
            'Supplier created successfully.',
            201
        );
    }

    public function show(Supplier $supplier): JsonResponse
    {
        $supplier = $this->supplierService
            ->find($supplier);

        return ApiResponse::success(
            SupplierResource::make($supplier),
            'Supplier retrieved successfully.'
        );
    }

    public function update(
        UpdateSupplierRequest $request,
        Supplier $supplier
    ): JsonResponse {
        $data = SupplierData::fromRequest($request);

        $supplier = $this->updateSupplierAction
            ->execute($supplier, $data);

        return ApiResponse::success(
            SupplierResource::make($supplier),
            'Supplier updated successfully.'
        );
    }

    public function destroy(Supplier $supplier): JsonResponse
    {
        $this->deleteSupplierAction
            ->execute($supplier);

        return ApiResponse::success(
            null,
            'Supplier deleted successfully.'
        );
    }

    public function restore(int $id): JsonResponse
    {
        $supplier = $this->restoreSupplierAction
            ->execute($id);

        return ApiResponse::success(
            SupplierResource::make($supplier),
            'Supplier restored successfully.'
        );
    }
}