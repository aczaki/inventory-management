<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->foreignId('category_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('unit_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('sku', 50)->unique();

            $table->string('barcode', 100)
                ->nullable()
                ->unique();

            $table->string('name', 150);

            $table->text('description')->nullable();

            $table->decimal('default_purchase_price', 15, 2)->default(0);

            $table->decimal('selling_price', 15, 2)->default(0);

            $table->unsignedInteger('minimum_stock')->default(0);

            $table->string('image')->nullable();

            $table->string('status', 20)->default('active');

            $table->timestamps();
            $table->softDeletes();

            $table->index('name');
            $table->index('sku');
            $table->index('barcode');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};