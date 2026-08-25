<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                ->constrained('products')
                ->restrictOnDelete()
                ->cascadeOnUpdate();

            $table->foreignId('warehouse_id')
                ->constrained('warehouses')
                ->restrictOnDelete()
                ->cascadeOnUpdate();

            $table->string('type', 20);

            $table->unsignedInteger('quantity');

            $table->string('reference_type', 50)->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();

            $table->text('notes')->nullable();

            $table->dateTime('transaction_date');

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->timestamps();

            $table->index(
                ['product_id', 'warehouse_id'],
                'inventory_transactions_product_warehouse_index'
            );

            $table->index(
                ['type'],
                'inventory_transactions_type_index'
            );

            $table->index(
                ['reference_type', 'reference_id'],
                'inventory_transactions_reference_index'
            );

            $table->index(
                ['transaction_date'],
                'inventory_transactions_date_index'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_transactions');
    }
};