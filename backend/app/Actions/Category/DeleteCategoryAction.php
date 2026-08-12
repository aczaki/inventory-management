<?php

namespace App\Actions\Category;

use App\Models\Category;
use App\Services\CategoryService;

class DeleteCategoryAction
{
    public function __construct(
        protected CategoryService $categoryService
    ) {
    }

    public function execute(Category $category): void
    {
        $this->categoryService->delete($category);
    }
}