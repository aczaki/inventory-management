<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $customers = Customer::query()
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {
                    $search = $request->input('search');

                    $query->where(function ($query) use ($search) {
                        $query->where('code', 'like', "%{$search}%")
                            ->orWhere(
                                'business_name',
                                'like',
                                "%{$search}%"
                            )
                            ->orWhere(
                                'contact_person',
                                'like',
                                "%{$search}%"
                            );
                    });
                }
            )
            ->latest()
            ->paginate(
                $request->integer('per_page', 15)
            );

        return CustomerResource::collection($customers);
    }

    public function store(StoreCustomerRequest $request): CustomerResource
    {
        $customer = Customer::create(
            $request->validated()
        );

        return new CustomerResource($customer);
    }

    public function show(Customer $customer): CustomerResource
    {
        return new CustomerResource($customer);
    }

    public function update(
        UpdateCustomerRequest $request,
        Customer $customer
    ): CustomerResource {
        $customer->update(
            $request->validated()
        );

        return new CustomerResource(
            $customer->fresh()
        );
    }

    public function destroy(Customer $customer): JsonResponse
    {
        $customer->delete();

        return response()->json([
            'message' => 'Customer berhasil dihapus.',
        ]);
    }
}