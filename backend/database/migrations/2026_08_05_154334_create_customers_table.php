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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();

            $table->string('code', 20)->unique();

            $table->string('business_name', 150);

            $table->string('contact_person', 100)->nullable();

            $table->string('email')->nullable();

            $table->string('phone', 20)->nullable();

            $table->text('address')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('business_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};