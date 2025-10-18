<?php

namespace App\Repositories;



/**
 * @method static \Illuminate\Database\Eloquent\Builder select($columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder latest($column = 'created_at')
 * @method static \Illuminate\Database\Eloquent\Builder paginate($perPage = 15, $columns = ['*'])
 */

use Spatie\Permission\Models\Role;
class RoleRepository
{

  public function getAll(array $fields)
  {
    return Role::select($fields)->latest()->paginate(10);
  }

  public function getById(int $id, array $fields)
  {
    return Role::select($fields)->findOrFail($id);
  }

  public function create(array $data)
  {
    return Role::create([
      "name" => $data["name"],
      "guard_name" => "web"
    ]);
  }

  public function update(int $id, array $data)
  {
    $role = Role::findOrFail($id);
    $role->update($data);
    return $role;
  }

  public function delete(int $id)
  {
    $role = Role::findOrFail($id);
    $role->delete();
  }
}