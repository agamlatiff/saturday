<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CategoryController extends Controller
{
    private CategoryService $categoryService;

    // Declare constructor method
    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    // Index method
    public function index()
    {
        // Get all data
        $fields = ["id", "name", "photo", "tagline"];
        $categories = $this->categoryService->getAll($fields ?? ["*"]);

        // Return all data as JSON response
        return response()->json(CategoryResource::collection($categories));
    }

    // Show method
    public function show(int $id)
    {
        try {
            // Get data by id
            $fields = ["id", "name", "photo", "tagline"];
            $category = $this->categoryService->getById($id, $fields);

            // Return one data as JSON response
            return response()->json(new CategoryResource($category));

        } catch (ModelNotFoundException $error) {
            // Return error response if data not found
            return response()->json([
                "message" => "category not found"
            ], 404);
        }
    }

    // Store method 
    public function store(CategoryRequest $request)
    {
        // Create data
        $category = $this->categoryService->create($request->validated());

        // Return created data as JSON response
        return response()->json(new CategoryResource($category), 201);
    }

    // Update method
    public function update(CategoryRequest $request, int $id)
    {
        try {
            // Update data
            $category = $this->categoryService->update($id, $request->validated());

            // Return updated data as JSON response
            return response()->json(new CategoryResource($category));
        } catch (ModelNotFoundException $error) {
            // Return error response if data not found
            return response()->json([
                "message" => "category not found"
            ], 404);
        }
    }
    
    // Delete method
    public function destroy (int $id) {
        try {
            // Delete data
            $this->categoryService->delete($id);

            // Return success response
            return response()->json([
                "message" => "category deleted"
            ]);
        }
        catch(ModelNotFoundException $error) {
            // Return failed response
            return response()->json([
                "message" => "category not found"
            ], 404);
        }
    }
    


}
