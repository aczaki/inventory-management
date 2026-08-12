<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'parent_id' => [
                'nullable',
                'integer',
                'exists:categories,id',
            ],

            'name' => [
                'required',
                'string',
                'max:100',
                'unique:categories,name',
            ],

            'slug' => [
                'required',
                'string',
                'max:100',
                'unique:categories,slug',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ];
    }
}