<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "phone" => $this->phone,
            "sub_total" => $this->sub_total,
            "tax_total" => $this->tax_total,
            "grand_total" => $this->grand_total,
            "merchant_id" => $this->merchant_id,

            // Relationships
            "merchant" => new MerchantResource($this->whenLoaded('merchant')),
            "products" => $this->whenLoaded('transactionProducts'),

            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
    }
}
