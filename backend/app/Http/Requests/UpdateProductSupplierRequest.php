<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'supplier_sku' => [
                'nullable',
                'string',
                'max:100',
            ],

            'last_purchase_price' => [
                'required',
                'numeric',
                'min:0',
            ],

            'is_primary' => [
                'required',
                'boolean',
            ],
        ];
    }
}