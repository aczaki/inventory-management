<?php

namespace App\Actions\Category;

use App\DTOs\Category\CategoryData;
use App\Models\Category;
use App\Services\CategoryService;

class UpdateCategoryAction
{
    public function __construct(
        protected CategoryService $categoryService
    ) {
    }

    public function execute(
        Category $category,
        CategoryData $data
    ): Category {
        return $this->categoryService->update(
            $category,
            $data
        );
    }
}