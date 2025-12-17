<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MerchantResource extends JsonResource
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
            'address' => $this->address,
            'photo' => $this->photo,
            'phone' => $this->phone,
            'keeper_id' => $this->keeper_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Relationships
            'keeper' => new UserResource($this->whenLoaded('keeper')),
            'products' => ProductResource::collection($this->whenLoaded('products')),
            'transactions' => TransactionResource::collection($this->whenLoaded('transactions')),
        ];
    }
}
