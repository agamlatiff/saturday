<?php

namespace App\Repositories;

use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthRepository
{
  public function login(array $data)
  {

    // Get credentials
    $credentials = [
      "email" => $data["email"],
      "password" => $data["password"]
    ];

    // Attempt to login
    if (!Auth::attempt($credentials)) {
      return response()->json([
        "message" => "The provided credentials do not match our records."
      ], 404);
    }

    // Regenerate session
    request()->session()->regenerate();

    // Get user
    /** @var User $user */
    $user = Auth::user();

    // Return response
    return response()->json([
      "message" => "Login successful",
      "user" => new UserResource($user->load("roles"))
    ]);
  }

  public function register(array $data)
  {
    // Create user
    $user = User::create([
      "name" => $data["name"],
      "email" => $data["email"],
      "phone" => $data["phone"],
      "photo" => $data["photo"],
      "password" => Hash::make($data["password"])
    ]);


    $user->assignRole("keeper");

    return $user;
  }

  public function tokenLogin(array $data)
  {

    // Attempt to login
    if (!Auth::attempt(["email" => $data["email"], "password" => $data["password"]])) {
      return response()->json(["message" => "Invalid credentials"], 401);
    }

    // Get user
    /** @var User $user */
    $user = Auth::user();
    $token = $user->createToken("API Token")->plainTextToken;

    // Return response
    return response()->json([
      "message" => "Login successful",
      "token" => $token,
      "user" => new UserResource($user->load("roles"))
    ]);
  }
}
