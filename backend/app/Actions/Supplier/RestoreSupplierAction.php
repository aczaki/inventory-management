<?php

namespace App\Actions\Supplier;

use App\Models\Supplier;
use App\Services\SupplierService;

class RestoreSupplierAction
{
    public function __construct(
        protected SupplierService $supplierService
    ) {
    }

    public function execute(int $id): Supplier
    {
        return $this->supplierService->restore($id);
    }
}