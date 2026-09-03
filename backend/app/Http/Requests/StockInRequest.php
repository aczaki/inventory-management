<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StockInRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => [
                'required',
                'integer',
                'exists:products,id',
            ],

            'warehouse_id' => [
                'required',
                'integer',
                'exists:warehouses,id',
            ],

            'quantity' => [
                'required',
                'integer',
                'min:1',
            ],
            
            'reference_number' => [
                'nullable',
                'string',
                'max:100',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'supplier_id' => [
                'nullable',
                'integer',
                'exists:suppliers,id',
            ],
        ];
    }
}