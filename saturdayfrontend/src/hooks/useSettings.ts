import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/axiosConfig";
import { AxiosError } from "axios";
import { ApiErrorResponse, User } from "../types/types";
import { SettingsFormData } from "../schemas/settingsSchema";
import { useAuth } from "./useAuth";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuth();

  return useMutation<
    User,
    AxiosError<ApiErrorResponse>,
    Partial<SettingsFormData>
  >({
    mutationFn: async (payload: Partial<SettingsFormData>) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const formData = new FormData();

      // Only append fields that are provided
      if (payload.name !== undefined) {
        formData.append("name", payload.name);
      }

      if (payload.phone !== undefined) {
        formData.append("phone", payload.phone);
      }

      if (payload.email !== undefined) {
        formData.append("email", payload.email);
      }

      // Only append password if provided and not empty
      if (payload.password && payload.password.trim().length > 0) {
        formData.append("password", payload.password);
        if (payload.password_confirmation) {
          formData.append(
            "password_confirmation",
            payload.password_confirmation
          );
        }
      }

      // Only append photo if it's a new file
      if (payload.photo && payload.photo instanceof File) {
        formData.append("photo", payload.photo);
      }

      const response = await apiClient.put("/user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    },
    onSuccess: (updatedUser) => {
      // Update the user in the auth context
      setUser(updatedUser);
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();

  return useMutation<void, AxiosError<ApiErrorResponse>, void>({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      await apiClient.delete(`/users/${user.id}`);
    },
    onSuccess: async () => {
      // Logout after account deletion
      await logout();
      queryClient.invalidateQueries();
    },
  });
};
