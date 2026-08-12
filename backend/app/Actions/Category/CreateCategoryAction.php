<?php

namespace App\Actions\Category;

use App\DTOs\Category\CategoryData;
use App\Models\Category;
use App\Services\CategoryService;

class CreateCategoryAction
{
    public function __construct(
        protected CategoryService $categoryService
    ) {
    }

    public function execute(CategoryData $data): Category
    {
        return $this->categoryService->store($data);
    }
}