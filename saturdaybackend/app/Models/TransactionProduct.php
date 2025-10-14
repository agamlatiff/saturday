<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionProduct extends Model
{
    //

    use SoftDeletes;

    protected $fillable = ["name", "phone", "product_id", "quantity", "price", "sub_total"];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
