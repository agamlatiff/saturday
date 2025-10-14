<?php

namespace App\Warehouse;

use App\Repositories\WarehouseRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class WarehouseService
{

  // Declare the constructor method & instance WarehouseRepository
  private WarehouseRepository $warehouseRepository;

  public function __construct(WarehouseRepository $warehouseRepository)
  {
    $this->warehouseRepository = $warehouseRepository;
  }

  // Get all data
  public function getAll(array $fields)
  {
    return $this->warehouseRepository->getAll($fields);
  }


  // Create data
  public function create(array $data)
  {
    // Checking photo existence from input
    if (isset($data["photo"]) && $data["photo"] instanceof UploadedFile) {
      // If valid, upload photo
      $data["photo"] = $this->uploadPhoto($data["photo"]);
    }

    // Create data
    return $this->warehouseRepository->create($data);
  }

  // Update data
  public function update(int $id, array $data)
  {
    // Get all data from database
    $fields = ["*"];
    $warehouse = $this->warehouseRepository->getById($id, $fields);

    // Checking photo existence from input 
    if (isset($data["photo"]) && $data["photo"] instanceof UploadedFile) {
      // Checking photo existence from database
      if (!empty($warehouse->photo)) {
        // Delete old photo from storage
        $this->deletePhoto($warehouse->photo);
      }

      // Upload new photo
      $data["photo"] = $this->uploadPhoto($data["photo"]);
    }
    return $this->warehouseRepository->update($id, $data);
  }


  // Attach product to warehouse
  public function attachProduct(int $warehouseId, int $productId, int $stock)
  {
    // Get warehouse data from database
    $warehouse = $this->warehouseRepository->getById($warehouseId, ["id"]);

    // Attach product to warehouse 
    $warehouse->products()->syncWithoutDetaching([
      $productId => ["stock" => $stock]
    ]);
  }

  // Detach product from warehouse
  public function detachProduct(int $warehouseId, int $productId)
  {
    // Get warehouse data from database
    $warehouse = $this->warehouseRepository->getById($warehouseId, ["id"]);

    // Detach product from warehouse
    $warehouse->products()->detach($productId);
  }

  // Update product stock in warehouse
  public function updateProductStock(int $warehouseId, int $productId, int $stock)
  {

    // Get warehouse data from database
    $warehouse = $this->warehouseRepository->getById($warehouseId, ["id"]);

    // Update stock data
    $warehouse->products()->updateExistingPivot($productId, ["stock" => $stock]);

    // Return warehouse data
    return $warehouse->products()->where("product_id", $productId)->first();
  }

  private function uploadPhoto(UploadedFile $photo)
  {
    // Upload photo
    return $photo->store("warehouses", "public");
  }


  private function deletePhoto(string $photoPath)
  {
    // Get relative path of photo
    $relativePath = "warehouses/" . basename($photoPath);

    // Checking photo existence from storage
    if (Storage::disk("public")->exists($relativePath)) {
      // If valid, delete photo from storage
      Storage::disk("public")->delete($relativePath);
    }


  }
}