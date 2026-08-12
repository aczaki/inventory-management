<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],

            'unit_id' => ['required', 'exists:units,id'],

            'sku' => [
                'required',
                'string',
                'max:50',
                Rule::unique('products')->ignore($this->route('product')),
            ],

            'barcode' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('products')->ignore($this->route('product')),
            ],

            'name' => ['required', 'string', 'max:150'],

            'description' => ['nullable', 'string'],

            'default_purchase_price' => ['required', 'numeric', 'min:0'],

            'selling_price' => ['required', 'numeric', 'gte:default_purchase_price'],

            'minimum_stock' => ['required', 'integer', 'min:0'],

            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],

            'status' => ['required', 'in:active,inactive'],
        ];
    }
}
