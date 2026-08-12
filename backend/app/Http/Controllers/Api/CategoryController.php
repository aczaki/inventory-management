<?php

namespace App\Http\Controllers\Api;

use App\Actions\Category\CreateCategoryAction;
use App\Actions\Category\DeleteCategoryAction;
use App\Actions\Category\RestoreCategoryAction;
use App\Actions\Category\UpdateCategoryAction;
use App\DTOs\Category\CategoryData;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService,
        protected CreateCategoryAction $createCategoryAction,
        protected UpdateCategoryAction $updateCategoryAction,
        protected DeleteCategoryAction $deleteCategoryAction,
        protected RestoreCategoryAction $restoreCategoryAction,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $categories = $this->categoryService->paginate(
            $request->only([
                'search',
                'parent_id',
                'sort_by',
                'sort_direction',
                'per_page',
            ])
        );

        return ApiResponse::success(
            CategoryResource::collection($categories),
            'Categories retrieved successfully.'
        );
    }

    public function store(
        StoreCategoryRequest $request
    ): JsonResponse {
        $data = CategoryData::fromRequest($request);

        $category = $this->createCategoryAction
            ->execute($data);

        return ApiResponse::success(
            CategoryResource::make($category),
            'Category created successfully.',
            201
        );
    }

    public function show(Category $category): JsonResponse
    {
        $category = $this->categoryService
            ->find($category);

        return ApiResponse::success(
            CategoryResource::make($category),
            'Category retrieved successfully.'
        );
    }

    public function update(
        UpdateCategoryRequest $request,
        Category $category
    ): JsonResponse {
        $data = CategoryData::fromRequest($request);

        $category = $this->updateCategoryAction
            ->execute($category, $data);

        return ApiResponse::success(
            CategoryResource::make($category),
            'Category updated successfully.'
        );
    }

    public function destroy(Category $category): JsonResponse
    {
        $this->deleteCategoryAction
            ->execute($category);

        return ApiResponse::success(
            null,
            'Category deleted successfully.'
        );
    }

    public function restore(int $id): JsonResponse
    {
        $category = $this->restoreCategoryAction
            ->execute($id);

        return ApiResponse::success(
            CategoryResource::make($category),
            'Category restored successfully.'
        );
    }
}