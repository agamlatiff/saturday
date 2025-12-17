<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'thumbnail' => $this->thumbnail,
            'about' => $this->about,
            'price' => $this->price,
            'category_id' => $this->category_id,
            'is_populer' => $this->is_populer,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Relationships
            'category' => new CategoryResource($this->whenLoaded('category')),
            'merchants' => MerchantResource::collection($this->whenLoaded('merchants')),
            'warehouses' => WarehouseResource::collection($this->whenLoaded('warehouses')),
            'transactions' => $this->whenLoaded('transactions', function () {
                return $this->transactions->map(function ($tp) {
                    return [
                        'id' => $tp->id,
                        'transaction_id' => $tp->transaction_id,
                        'quantity' => $tp->quantity,
                        'price' => $tp->price,
                        'sub_total' => $tp->sub_total,
                    ];
                });
            }),
        ];
    }
}
