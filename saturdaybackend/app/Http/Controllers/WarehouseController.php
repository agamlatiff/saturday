<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\WarehouseRequest;
use App\Http\Resources\WarehouseResource;
use App\Services\WarehouseService;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class WarehouseController extends Controller
{
    // Declare WarehouseService instance Service
    private WarehouseService $warehouseService;

    // Declare constructor method
    public function __construct(WarehouseService $warehouseService)
    {
        $this->warehouseService = $warehouseService;
    }

    // Get all data from database
    public function index()
    {
        // Get fields from request
        $fields = ["id", "name", "photo"];
        // Get all data from database based on fields
        $warehouses = $this->warehouseService->getAll($fields ?? ["*"]);
        // Return all data as JSON response
        return response()->json(WarehouseResource::collection($warehouses));

    }

    public function show(int $id)
    {
        try {
            $fields = ["id", "name", "photo", "phone"]; // Fields
            // Get data by id from database based on fields
            $warehouse = $this->warehouseService->getById($id, $fields);
            // Return one data as JSON response
            return response()->json(new WarehouseResource($warehouse));
        } catch (ModelNotFoundException $error) {
            // Return error response if data not found
            return response()->json([
                "message" => "warehouse not found"
            ], 404);
        }

    }

    // Store method
    public function store(WarehouseRequest $request)
    {
        // Create data by validated request
        $warehouse = $this->warehouseService->create($request->validated());
        // Return created data as JSON response
        return response()->json(new WarehouseResource($warehouse), 201);
    }

    // Update method
    public function update(WarehouseRequest $request, int $id)
    {
        try {
            // Update data by validated request
            $warehouse = $this->warehouseService->update($id, $request->validated());
            //  Return response as JSON if data validated
            return response()->json(new WarehouseResource($warehouse));
        } catch (ModelNotFoundException $error) {
            // Return error response if data not found
            return response()->json([
                "message" => "Warehouse not found"
            ], 404);
        }
    }
    
    public function destroy (int $id) {
        try {
            $this->warehouseService->delete($id);
            return response()->json([
                "message" => "warehouse deleted successfully"
            ]);
        } catch (ModelNotFoundException $error) {
            return response()->json([
                "message" => "warehouse not found"
            ], 404);
        }
    }


}
