<?php

namespace App\Actions\Supplier;

use App\Models\Supplier;
use App\Services\SupplierService;

class DeleteSupplierAction
{
    public function __construct(
        protected SupplierService $supplierService
    ) {
    }

    public function execute(Supplier $supplier): void
    {
        $this->supplierService->delete($supplier);
    }
}