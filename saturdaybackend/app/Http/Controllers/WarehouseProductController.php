<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\WarehouseProductRequest;
use App\Http\Requests\WarehouseProductUpdateRequest;
use App\Http\Requests\WarehouseRequest;
use App\Warehouse\WarehouseService;

class WarehouseProductController extends Controller
{

    // Create data instance of warehouse service
    private WarehouseService $warehouseService;
    public function __construct(WarehouseService $warehouseService)
    {
        $this->warehouseService = $warehouseService;
    }

    public function attach(WarehouseProductRequest $request, int $warehouseId)
    {
        // validated input, then attach product and stock
        $this->warehouseService->attachProduct($warehouseId, $request->validated()->input("product_id"), $request->validated()->input("stock"));

        return response()->json(["message" => "Product attached successfully"]);
    }

    public function detach(int $warehouseId, int $productId)
    {
        // Detach product and stock
        $this->warehouseService->detachProduct($warehouseId, $productId);

        return response()->json(["message" => "product detached successfully"]);
    }
    
    public function update (WarehouseProductUpdateRequest $request, int $warehouseId, int $productId) {
        
        $warehouseProduct = $this->warehouseService->updateProductStock($warehouseId, $productId, $request->validated())["stock"];
        
        return response()->json([
            "message" => "Stock updated successfully",
            "data" => $warehouseProduct
        ]);
    }


}
