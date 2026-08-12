<?php

namespace App\Actions\Category;

use App\Models\Category;
use App\Services\CategoryService;

class RestoreCategoryAction
{
    public function __construct(
        protected CategoryService $categoryService
    ) {
    }

    public function execute(int $id): Category
    {
        return $this->categoryService->restore($id);
    }
}