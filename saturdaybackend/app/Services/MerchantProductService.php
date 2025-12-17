<?php

namespace App\Services;

use App\Models\Merchant;
use App\Repositories\MerchantProductRepository;
use App\Repositories\MerchantRepository;
use App\Repositories\WarehouseProductRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MerchantProductService
{

  // Assign data from repository
  private MerchantProductRepository $merchantProductRepository;
  private WarehouseProductRepository $warehouseProductRepository;
  private MerchantRepository $merchantRepository;

  public function __construct(MerchantProductRepository $merchantProductRepository, WarehouseProductRepository $warehouseProductRepository, merchantRepository $merchantRepository)
  {
    $this->merchantRepository = $merchantRepository;
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

  public function updateStock(int $merchantId, int $productId, int $newStock, int $warehouseId)
  {
    return DB::transaction(function () use ($merchantId, $productId, $newStock, $warehouseId) {

      // Checking data in database
      $existing = $this->merchantProductRepository->getByMerchantAndProduct($merchantId, $productId);

      // Validation data 
      if (!$existing) {
        throw ValidationException::withMessages([
          "product" => ["Product not assigned to this merchant."]
        ]);
      }

      if (!$warehouseId) {
        throw ValidationException::withMessages([
          "warehouse_id" => ["Warehouse ID is required when increasing stock."]
        ]);
      }

      // Current stock in merchant
      $currentStock = $existing->stock;

      // Validation when new stock greatest then current stock
      if ($newStock > $currentStock) {
        $diff = $newStock - $currentStock;

        // Checking product
        $warehouseProduct = $this->warehouseProductRepository->getByWarehouseAndProduct($warehouseId, $productId);

        // Validation data
        if (!$warehouseProduct || $warehouseProduct->stock < $diff) {
          throw ValidationException::withMessages([
            "Stock" => ["Insufficient stock in warehouse"]
          ]);
        }

        // Subtraction stock
        $this->warehouseProductRepository->updateStock(
          $warehouseId,
          $productId,
          $warehouseProduct->stock - $diff
        );

      }

      // Validation when new stock lowest then current stock
      if ($newStock < $currentStock) {
        $diff = $currentStock - $newStock;

        // Checking product
        $warehouseProduct = $this->warehouseProductRepository->getByWarehouseAndProduct($warehouseId, $productId);

        // Validation data product
        if (!$warehouseProduct) {
          throw ValidationException::withMessages([
            "warehouse" => ["Product not found in warehouse."]
          ]);
        }

        // Update stock 
        $this->warehouseProductRepository->updateStock($warehouseId, $productId, $warehouseProduct->stock + $diff);
      }


      return $this->merchantProductRepository->updateStock($warehouseId, $productId, $newStock);

    });
  }

  public function removeProductFromMerchant(int $merchantId, int $productId)
  {
    // $merchant = Merchant::findOrFail($merchantId);

    // Get one data from database
    $merchant = $this->merchantRepository->getById($merchantId, $fields ?? ["*"]);

    //  Checking if merchant not exists
    if (!$merchant) {
      throw ValidationException::withMessages([
        "merchant" => ["Merchant is not found."]
      ]);
    }

    // Get data merchant and product from database
    $exists = $this->merchantProductRepository->getByMerchantAndProduct($merchantId, $productId);

    //  Checking if data not exists
    if (!$exists) {
      throw ValidationException::withMessages([
        "product" => ["Product not assigned to this merchant."]
      ]);
    }

    $merchant->products()->detach($productId);

  }

}