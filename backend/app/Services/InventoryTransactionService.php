<?php

namespace App\Services;

use App\Models\InventoryTransaction;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class InventoryTransactionService
{
    public function create(array $data): InventoryTransaction
    {
        return DB::transaction(function () use ($data) {
            $userId = $data['user_id'] ?? auth()->id();

            if (!$userId) {
                throw new RuntimeException(
                    'User yang melakukan transaksi wajib tersedia.'
                );
            }

            return InventoryTransaction::create([
                'transaction_number' => $this->generateTransactionNumber(),

                'type' => $data['type'],

                'warehouse_id' => $data['warehouse_id'],

                'customer_id' => $data['customer_id'] ?? null,

                'user_id' => $userId,

                'reference_type' => $data['reference_type'] ?? null,

                'reference_number' => $data['reference_number'] ?? null,

                'notes' => $data['notes'] ?? null,

                'transaction_date' => $data['transaction_date']
                    ?? now(),
            ]);
        });
    }

    protected function generateTransactionNumber(): string
    {
        $date = now()->format('Ymd');

        $prefix = "TRX-{$date}-";

        $lastTransaction = InventoryTransaction::query()
            ->where(
                'transaction_number',
                'like',
                "{$prefix}%"
            )
            ->orderByDesc('id')
            ->lockForUpdate()
            ->first();

        $nextNumber = $lastTransaction
            ? ((int) substr(
                $lastTransaction->transaction_number,
                -6
            )) + 1
            : 1;

        return $prefix . str_pad(
            $nextNumber,
            6,
            '0',
            STR_PAD_LEFT
        );
    }
}