<?php

namespace App\Repositories;

use App\Models\WarehouseProduct;
use Illuminate\Validation\ValidationException;

class WarehouseProductRepository
{
  public function getByWarehouseAndProduct(int $warehouseId, int $productId): ?WarehouseProduct
  {
    // Get first data warehouse & product 
    return WarehouseProduct::where("warehouse_id", $warehouseId)->where("product_id", $productId)->first();
  }
  
  public function updateStock (int $warehouseId, int $productid, int $stock) {
    // Check data warehouse & product
    $warehouseProduct = $this->getByWarehouseAndProduct($warehouseId, $productid);
    
    // Checking data
    if(!$warehouseProduct) {
      throw ValidationException::withMessages([
        "product_id" => ["Product not found for this warehouse"]
      ]);
    }
    
    // If valid, update stock
    $warehouseProduct->update(["stock"=> $stock]);
    return $warehouseProduct;
  }
}