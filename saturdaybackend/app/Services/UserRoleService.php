<?php

namespace App\Services;

use App\Repositories\UserRoleRepository;

class UserRoleService
{
  private UserRoleRepository $UserRoleRepository;

  public function __construct(UserRoleRepository $UserRoleRepository)
  {
    $this->UserRoleRepository = $UserRoleRepository;
  }

  public function assignRole(int $userId, int $roleId)
  {
    return $this->UserRoleRepository->assignRoleToUser($userId, $roleId);
  }

  public function removeRole(int $userId, int $roleId)
  {
    return $this->UserRoleRepository->removeRoleFromUser($userId, $roleId);
  }

  public function listUserRoles(int $userId)
  {
    return $this->UserRoleRepository->getUserRoles($userId);
  }
}