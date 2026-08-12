<?php

namespace App\Actions\Supplier;

use App\DTOs\Supplier\SupplierData;
use App\Models\Supplier;
use App\Services\SupplierService;

class CreateSupplierAction
{
    public function __construct(
        protected SupplierService $supplierService
    ) {
    }

    public function execute(SupplierData $data): Supplier
    {
        return $this->supplierService->store($data);
    }
}