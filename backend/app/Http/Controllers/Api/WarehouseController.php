<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WarehouseController extends Controller
{
    /**
     * Display a listing of warehouses.
     */
    public function index()
    {
        $warehouses = Warehouse::latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Warehouses retrieved successfully',
            'data' => $warehouses,
        ]);
    }

    /**
     * Store a newly created warehouse.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:20',
                'unique:warehouses,code',
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'address' => [
                'nullable',
                'string',
            ],
            'description' => [
                'nullable',
                'string',
            ],
            'status' => [
                'required',
                Rule::in(['active', 'inactive']),
            ],
        ]);

        $warehouse = Warehouse::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Warehouse created successfully',
            'data' => $warehouse,
        ], 201);
    }

    /**
     * Display the specified warehouse.
     */
    public function show(Warehouse $warehouse)
    {
        return response()->json([
            'success' => true,
            'message' => 'Warehouse retrieved successfully',
            'data' => $warehouse,
        ]);
    }

    /**
     * Update the specified warehouse.
     */
    public function update(Request $request, Warehouse $warehouse)
    {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:20',
                Rule::unique('warehouses', 'code')
                    ->ignore($warehouse->id),
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'address' => [
                'nullable',
                'string',
            ],
            'description' => [
                'nullable',
                'string',
            ],
            'status' => [
                'required',
                Rule::in(['active', 'inactive']),
            ],
        ]);

        $warehouse->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Warehouse updated successfully',
            'data' => $warehouse->fresh(),
        ]);
    }

    /**
     * Remove the specified warehouse.
     */
    public function destroy(Warehouse $warehouse)
    {
        $warehouse->delete();

        return response()->json([
            'success' => true,
            'message' => 'Warehouse deleted successfully',
        ]);
    }

    /**
     * Restore the specified warehouse.
     */
    public function restore($id)
    {
        $warehouse = Warehouse::withTrashed()->findOrFail($id);

        $warehouse->restore();

        return response()->json([
            'success' => true,
            'message' => 'Warehouse restored successfully',
            'data' => $warehouse->fresh(),
        ]);
    }
}