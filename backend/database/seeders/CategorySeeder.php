<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Elektronik',
            'Laptop',
            'Monitor',
            'Keyboard',
            'Mouse',
            'Printer',
            'Networking',
            'Storage',
            'Office',
            'Aksesoris',
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => Str::slug($category)],
                [
                    'name' => $category,
                    'description' => null,
                    'parent_id' => null,
                ]
            );
        }
    }
}