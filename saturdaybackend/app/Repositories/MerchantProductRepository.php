<?php

namespace App\Repositories;

use App\Models\MerchantProduct;
use Illuminate\Validation\ValidationException;

class MerchantProductRepository
{

  // Create data, then we can validate data
  public function create(array $data)
  {
    return MerchantProduct::create($data);
  }

  // For checking is the data before have a product
  public function getByMerchantAndProduct(int $merchantId, int $productId)
  {
    return MerchantProduct::where("merchant_id", $merchantId)->where("product_id", $productId)->first();
  }

  // Update stock product in merchant, we can use in controller
  public function updateStock(int $merchantId, int $productId, int $stock)
  {
    $merchantProduct = $this->getByMerchantAndProduct($merchantId, $productId);

    if (!$merchantProduct) {
      throw ValidationException::withMessages([
        "product_id" => ["Product not found for this merchant"]
      ]);
    }

    $merchantProduct->update(['stock' => $stock]);

    return $merchantProduct;


  }
  
  
}