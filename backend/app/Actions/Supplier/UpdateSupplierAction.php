<?php

namespace App\Actions\Supplier;

use App\DTOs\Supplier\SupplierData;
use App\Models\Supplier;
use App\Services\SupplierService;

class UpdateSupplierAction
{
    public function __construct(
        protected SupplierService $supplierService
    ) {
    }

    public function execute(
        Supplier $supplier,
        SupplierData $data
    ): Supplier {
        return $this->supplierService->update(
            $supplier,
            $data
        );
    }
}