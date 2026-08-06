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

            $table->string('transaction_number', 50)->unique();

            $table->string('type', 20);

            $table->foreignId('warehouse_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('customer_id')
                ->nullable()
                ->constrained()
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('reference_type', 50)->nullable();

            $table->string('reference_number', 100)->nullable();

            $table->text('notes')->nullable();

            $table->date('transaction_date');

            $table->timestamps();

            $table->index('transaction_date');
            $table->index('type');
            $table->index('warehouse_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_transactions');
    }
};