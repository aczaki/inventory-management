<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $supplier = $this->route('supplier');

        return [
            'code' => [
                'required',
                'string',
                'max:20',
                Rule::unique('suppliers', 'code')
                    ->ignore($supplier->id),
            ],

            'name' => [
                'required',
                'string',
                'max:150',
            ],

            'email' => [
                'nullable',
                'email',
                'max:100',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:20',
            ],

            'address' => [
                'nullable',
                'string',
            ],

            'contact_person' => [
                'nullable',
                'string',
                'max:100',
            ],

            'status' => [
                'required',
                'in:active,inactive',
            ],
        ];
    }
}