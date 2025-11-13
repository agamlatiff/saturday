<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // User can always update their own profile
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = $this->user();
        
        return [
            "name" => "nullable|string|max:255|min:3",
            "email" => "nullable|string|email|unique:users,email," . $user->id,
            "password" => "nullable|string|min:6",
            "password_confirmation" => "nullable|string|min:6|same:password",
            "photo" => "nullable|image|mimes:jpeg,png,jpg|max:2048",
            "phone" => "nullable|string|max:15|min:10"
        ];
    }
}

