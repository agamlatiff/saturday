<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    private AuthService $authService;
    private UserService $userService;
    
    public function __construct(AuthService $authService, UserService $userService)
    {
        $this->authService = $authService;
        $this->userService = $userService;
    }

    public function register(RegisterRequest $request)
    {
        $user = $this->authService->register($request->validated());


        return response()->json([
            "message" > "User register successfully",
            "user" => $user
        ]);
    }

    public function login(LoginRequest $loginRequest)
    {
        return $this->authService->login($loginRequest->validated());
    }

    public function tokenLogin(LoginRequest $request)
    {
        return $this->authService->tokenLogin($request->validated());
    }

    public function logout(Request $request)
    {
        Auth::guard("web")->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            "message" => "Logged out successfully"
        ]);
    }

    public function user(Request $request)
    {
        return response()->json(new UserResource($request->user()));
    }

    public function updateProfile(ProfileUpdateRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();
        
        // Only include fields that were actually provided
        $dataToUpdate = [];
        
        if (isset($validated['name']) && !empty($validated['name'])) {
            $dataToUpdate['name'] = $validated['name'];
        }
        
        if (isset($validated['email']) && !empty($validated['email'])) {
            $dataToUpdate['email'] = $validated['email'];
        }
        
        if (isset($validated['phone'])) {
            $dataToUpdate['phone'] = $validated['phone'];
        }
        
        if (isset($validated['password']) && !empty($validated['password'])) {
            $dataToUpdate['password'] = $validated['password'];
        }
        
        if (isset($validated['photo']) && $validated['photo']) {
            $dataToUpdate['photo'] = $validated['photo'];
        }
        
        // Remove password_confirmation as it's not needed in the service
        unset($dataToUpdate['password_confirmation']);
        
        // Only update if there's something to update
        if (empty($dataToUpdate)) {
            return response()->json(new UserResource($user->load('roles')));
        }
        
        $updatedUser = $this->userService->update($user->id, $dataToUpdate);
        
        return response()->json(new UserResource($updatedUser->load('roles')));
    }
}
