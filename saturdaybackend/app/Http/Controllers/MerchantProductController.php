<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\MerchantProductRequest;
use App\Http\Requests\MerchantProductUpdateRequest;
use App\Services\MerchantProductService;

use Illuminate\Http\Request;

class MerchantProductController extends Controller
{
    //    Declare dependency 

    private MerchantProductService $merchantProductService;
    public function __construct(MerchantProductService $merchantProductService)
    {
        $this->merchantProductService = $merchantProductService;
    }

    public function store(MerchantProductRequest $request, int $merchant)
    {
        // Validated data from input data 
        $validated = $request->validated();
        $validated["merchant_id"] = $merchant;

        // Validation from service 
        $merchantProduct = $this->merchantProductService->assignProductToMerchant($validated);


        // If valid, return data as JSON
        return response()->json([
            "message" => "Product assigned to merchant successfully",
            "data" => $merchantProduct
        ], 201);
    }

    public function update(MerchantProductUpdateRequest $request, int $merchantId, $productId)
    {
        // Validation data from input
        $validated = $request->validated();

        // Validation logic from service
        $merchantProduct = $this->merchantProductService->updateStock($merchantId, $productId, $validated["stock"], $validated["warehouse_id"]);

        // If valid, return data as JSON
        return response()->json([
            "message" => "Stock updated successfully",
            "data" => $merchantProduct
        ]);
    }

    public function destroy(int $merchant, int $product)
    {
        // Remove data and validation login from service
        $this->merchantProductService->removeProductFromMerchant($merchant, $product);

        
        // If valid, return message as JSON
        return response()->json([
            "message" => "Product detached from merchant successfully"
        ]);
    }
}
