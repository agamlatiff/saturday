<?php

namespace App\Services;

use App\Repositories\MerchantProductRepository;
use App\Repositories\WarehouseProductRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MerchantProductService
{

  // Assign data from repository
  private MerchantProductRepository $merchantProductRepository;
  private WarehouseProductRepository $warehouseProductRepository;

  public function __construct(MerchantProductRepository $merchantProductRepository, WarehouseProductRepository $warehouseProductRepository)
  {
    $this->merchantProductRepository = $merchantProductRepository;
    $this->warehouseProductRepository = $warehouseProductRepository;
  }


  // Checking if stock not enough or product exists
  public function assignProductToMerchant(array $data)
  {
    return DB::transaction(function () use ($data) {
      $warehouseProduct = $this->warehouseProductRepository->getByWarehouseAndProduct($data["warehouse_id"], $data["product_id"]);

      if (!$warehouseProduct || $warehouseProduct->stock < $data["stock"]) {
        throw ValidationException::withMessages([
          "stock" => ["Insufficient stock in warehouse"]
        ]);
      }

      $existingProduct = $this->merchantProductRepository->getByMerchantAndProduct($data["merchant_id"], $data["product_id"]);

      if ($existingProduct) {
        throw ValidationException::withMessages([
          "Product" => ["Product already exists in this merchant."]
        ]);
      }

      $this->warehouseProductRepository->updateStock($data["warehouse_id"], $data["product_id"], $warehouseProduct->stock - $data["stock"]);

      return $this->merchantProductRepository->create(
        [
          "warehouse_id" => $data["warehouse_id"],
          "merchant_id" => $data["merchant_id"],
          "product_id" => $data["product_id"],
          "stock" => $data["stock"]
        ]
      );

    });
  }

}