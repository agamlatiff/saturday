<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CategoryService
{
  private $categoryRepository;


  // Declare the constructor method
  public function __construct(CategoryRepository $categoryRepository)
  {
    $this->categoryRepository = $categoryRepository;
  }

  // Get all data
  public function getAll(array $fields)
  {
    return $this->categoryRepository->getAll($fields);
  }

  // Get by id
  public function getById(int $id, array $fields)
  {
    return $this->categoryRepository->getById($id, $fields ?? ["*"]);
  }

  // Create data
  public function create(array $data)
  {

    // Checking photo existence 
    if (isset($data["photo"]) && $data["photo"] instanceof UploadedFile) {
      $data["photo"] = $this->uploadPhoto($data["photo"]);
    }

    return $this->categoryRepository->create($data);
  }

  public function update(int $id, array $data)
  {
    // Get data from database
    $fields = ["id", "photo"];
    $category = $this->categoryRepository->getById($id, $fields);

    // Checking photo existence from input 
    if (isset($data["photo"]) && $data["photo"] instanceof UploadedFile) {
      // Checking photo existence from database
      if (!empty($category->photo)) {
        // Delete old photo from storage
        $this->deletePhoto($category->photo);
      }
      // Upload new photo
      $data["photo"] = $this->uploadPhoto($data["photo"]);
    }
    // Update data
    return $this->categoryRepository->update($id, $data);
  }

  // Delete data
  public function delete(int $id)
  {
    // Get data from database
    $fields = ["id", "photo"];
    $category = $this->categoryRepository->getById($id, $fields);

    // Checking photo existence from database
    if ($category->photo) {
      // Delete photo from storage
      $this->deletePhoto($category->photo);
    }

    // Delete data
    $this->categoryRepository->delete($id);
  }

  // Upload photo method
  private function uploadPhoto(UploadedFile $photo)
  {
    return $photo->store("categories", "public");
  }

  // Delete photo method
  private function deletePhoto(string $photoPath)
  {
    $relativePath = "categories/" . basename($photoPath);
    if (Storage::disk("public")->exists($relativePath)) {
      Storage::disk("public")->delete($relativePath);
    }
  }
}