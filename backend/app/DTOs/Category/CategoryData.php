<?php

namespace App\DTOs\Category;

use Illuminate\Http\Request;

readonly class CategoryData
{
    public function __construct(
        public ?int $parentId,
        public string $name,
        public string $slug,
        public ?string $description,
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            parentId: $request->input('parent_id'),
            name: $request->input('name'),
            slug: $request->input('slug'),
            description: $request->input('description'),
        );
    }

    public function toArray(): array
    {
        return [
            'parent_id' => $this->parentId,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
        ];
    }
}