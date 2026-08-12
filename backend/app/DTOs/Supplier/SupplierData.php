<?php

namespace App\DTOs\Supplier;

use Illuminate\Http\Request;

readonly class SupplierData
{
    public function __construct(
        public string $code,
        public string $name,
        public ?string $email,
        public ?string $phone,
        public ?string $address,
        public ?string $contactPerson,
        public string $status,
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            code: $request->input('code'),
            name: $request->input('name'),
            email: $request->input('email'),
            phone: $request->input('phone'),
            address: $request->input('address'),
            contactPerson: $request->input('contact_person'),
            status: $request->input('status'),
        );
    }

    public function toArray(): array
    {
        return [
            'code' => $this->code,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'contact_person' => $this->contactPerson,
            'status' => $this->status,
        ];
    }
}