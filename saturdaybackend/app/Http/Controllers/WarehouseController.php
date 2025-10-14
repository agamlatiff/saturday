<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Warehouse\WarehouseService;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    // Declare WarehouseService instance Service
    private WarehouseService $warehouseService;

    // Declare constructor method
    public function __construct(WarehouseService $warehouseService)
    {
        $this->warehouseService = $warehouseService;
    }

    // Get all data from database
    public function index() {
        $fields = ["id", "name", "photo"];
        // my learning until 13:20
    }

}
