import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useUpdateProfile, useDeleteAccount } from "../hooks/useSettings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsFormData, settingsSchema } from "../schemas/settingsSchema";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../types/types";
import UserProfileCard from "../components/UserProfileCard";
import SearchButton from "../components/SearchButton";
import { useAuth } from "../hooks/useAuth";
import { EyeIcon, EyeOffIcon, LogOut, Trash2 } from "lucide-react";
import PopupDeleteAccount from "../components/PopupDeleteAccount";

const Settings = () => {
  const { user, logout } = useAuth();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState(
    "/assets/images/icons/gallery-grey.svg"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [hasPhotoChanged, setHasPhotoChanged] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  // Watch form values to detect changes
  const watchedName = watch("name");
  const watchedPhone = watch("phone");
  const watchedEmail = watch("email");
  const watchedPassword = watch("password");

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("phone", user.phone || "");
      setValue("email", user.email);
      if (user.photo) {
        setImagePreview(user.photo);
      }
    }
  }, [user, setValue]);

  // Check if form has changes
  const hasChanges = () => {
    if (!user) return false;

    // Check name
    if (watchedName && watchedName !== user.name) return true;

    // Check phone
    const currentPhone = watchedPhone || "";
    const originalPhone = user.phone || "";
    if (currentPhone !== originalPhone) return true;

    // Check email
    if (watchedEmail && watchedEmail !== user.email) return true;

    // Check password
    if (watchedPassword && watchedPassword.length > 0) return true;

    // Check photo
    if (hasPhotoChanged) return true;

    return false;
  };

  const isFormDirty = hasChanges();

  const onSubmit = (data: SettingsFormData) => {
    if (!user) return;

    // Only send changed fields
    const payload: Partial<SettingsFormData> = {};

    if (data.name && data.name !== user.name) {
      payload.name = data.name;
    }

    if (data.email && data.email !== user.email) {
      payload.email = data.email;
    }

    const currentPhone = data.phone || "";
    const originalPhone = user.phone || "";
    if (currentPhone !== originalPhone) {
      payload.phone = currentPhone;
    }

    if (data.password && data.password.length > 0) {
      payload.password = data.password;
      payload.password_confirmation = data.password_confirmation;
    }

    if (hasPhotoChanged && data.photo) {
      payload.photo = data.photo;
    }

    // Don't submit if no changes
    if (Object.keys(payload).length === 0) {
      return;
    }

    updateProfile(payload, {
      onSuccess: () => {
        setIsEditing(false);
        setHasPhotoChanged(false);
        // Clear password fields after successful update
        setValue("password", "");
        setValue("password_confirmation", "");
      },
      onError: (error: AxiosError<ApiErrorResponse>) => {
        if (error.response?.data.errors) {
          Object.entries(error.response.data.errors).forEach(
            ([key, messages]) => {
              setError(key as keyof SettingsFormData, {
                type: "server",
                message: messages[0],
              });
            }
          );
        }
      },
    });
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    deleteAccount();
    setShowDeleteModal(false);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div id="main-container" className="flex flex-1">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-6 pt-0">
        <div
          id="Top-Bar"
          className="flex items-center w-full gap-6 mt-[30px] mb-6"
        >
          <div className="flex items-center gap-6 h-[92px] bg-white w-full rounded-3xl p-[18px]">
            <div className="flex flex-col gap-[6px] w-full">
              <h1 className="font-bold text-2xl">Settings</h1>
              <p className="font-semibold text-lg text-monday-gray">
                Manage your profile and account settings
              </p>
            </div>
            <div className="flex items-center flex-nowrap gap-3">
              <SearchButton />
            </div>
          </div>
          <UserProfileCard />
        </div>
        <main className="flex flex-col gap-6 flex-1">
          <div className="flex gap-6 flex-col md:flex-row">
            {/* Profile Display/Edit Form */}
            <div className="flex flex-col w-full rounded-3xl p-[18px] gap-5 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-xl capitalize">
                  {isEditing ? "Edit Profile" : "Profile Information"}
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-black font-semibold"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-5"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="group relative flex size-[100px] rounded-2xl overflow-hidden items-center justify-center bg-monday-background">
                      <img
                        id="Thumbnail"
                        src={imagePreview}
                        className="size-full object-contain"
                        alt="icon"
                      />
                      <input
                        type="file"
                        id="File-Input"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setValue("photo", file);
                            setImagePreview(URL.createObjectURL(file));
                            setHasPhotoChanged(true);
                          } else {
                            setImagePreview(
                              user.photo ||
                                "/assets/images/icons/gallery-grey.svg"
                            );
                            setHasPhotoChanged(false);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-black w-[152px] font-semibold text-nowrap"
                    >
                      {imagePreview !== "/assets/images/icons/gallery-grey.svg"
                        ? "Change Photo"
                        : "Add Photo"}
                    </button>
                  </div>
                  {errors.photo && (
                    <p className="text-red-500">{errors.photo.message}</p>
                  )}

                  <label className="group relative">
                    <div className="flex items-center pr-4 absolute transform -translate-y-1/2 top-1/2 left-6 border-r-[1.5px] border-monday-border ">
                      <img
                        src="/assets/images/icons/profile-grey.svg"
                        className="flex size-6 shrink-0"
                        alt="icon"
                      />
                    </div>
                    <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:placeholder-shown]:top-[36px] group-focus-within:top-[25px] transition-300">
                      Full Name
                    </p>
                    <input
                      {...register("name")}
                      type="text"
                      className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-6 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300"
                      placeholder=""
                    />
                  </label>
                  {errors.name && (
                    <p className="text-red-500">{errors.name.message}</p>
                  )}

                  <label className="group relative">
                    <div className="flex items-center pr-4 absolute transform -translate-y-1/2 top-1/2 left-6 border-r-[1.5px] border-monday-border ">
                      <img
                        src="/assets/images/icons/call-grey.svg"
                        className="flex size-6 shrink-0"
                        alt="icon"
                      />
                    </div>
                    <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:placeholder-shown]:top-[36px] group-focus-within:top-[25px] transition-300">
                      Phone Number
                    </p>
                    <input
                      type="tel"
                      {...register("phone")}
                      className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-6 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300"
                      placeholder=""
                    />
                  </label>
                  {errors.phone && (
                    <p className="text-red-500">{errors.phone.message}</p>
                  )}

                  <label className="group relative">
                    <div className="flex items-center pr-4 absolute transform -translate-y-1/2 top-1/2 left-6 border-r-[1.5px] border-monday-border ">
                      <img
                        src="/assets/images/icons/sms-grey.svg"
                        className="flex size-6 shrink-0"
                        alt="icon"
                      />
                    </div>
                    <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:placeholder-shown]:top-[36px] group-focus-within:top-[25px] transition-300">
                      Email Address
                    </p>
                    <input
                      {...register("email")}
                      type="email"
                      className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-6 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300"
                      placeholder=""
                    />
                  </label>
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}

                  <div className="border-t border-monday-border pt-5">
                    <p className="font-semibold text-lg mb-4">
                      Change Password (Optional)
                    </p>
                    <div className="flex flex-col gap-4">
                      <label className="group relative">
                        <div className="flex items-center pr-4 absolute transform -translate-y-1/2 top-1/2 left-6 border-r-[1.5px] border-monday-border ">
                          <img
                            src="/assets/images/icons/key-grey.svg"
                            className="flex size-6 shrink-0"
                            alt="icon"
                          />
                        </div>
                        <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:placeholder-shown]:top-[36px] group-focus-within:top-[25px] transition-300">
                          New Password
                        </p>
                        <input
                          {...register("password")}
                          type={showPassword ? "text" : "password"}
                          className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-6 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300 tracking-[0.3em]"
                          placeholder="*"
                        />
                        {showPassword ? (
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <EyeIcon className="size-6 absolute right-6 top-1/2 transform -translate-y-1/2 text-monday-gray" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <EyeOffIcon className="size-6 absolute right-6 top-1/2 transform -translate-y-1/2 text-monday-gray" />
                          </button>
                        )}
                      </label>
                      {errors.password && (
                        <p className="text-red-500">
                          {errors.password.message}
                        </p>
                      )}

                      <label className="group relative mt-4">
                        <div className="flex items-center pr-4 absolute transform -translate-y-1/2 top-1/2 left-6 border-r-[1.5px] border-monday-border ">
                          <img
                            src="/assets/images/icons/key-grey.svg"
                            className="flex size-6 shrink-0"
                            alt="icon"
                          />
                        </div>
                        <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:placeholder-shown]:top-[36px] group-focus-within:top-[25px] transition-300">
                          Confirm Password
                        </p>
                        <input
                          {...register("password_confirmation")}
                          type={showPasswordConfirmation ? "text" : "password"}
                          className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-6 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300 tracking-[0.3em]"
                          placeholder=""
                        />
                        {showPasswordConfirmation ? (
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswordConfirmation(
                                !showPasswordConfirmation
                              )
                            }
                          >
                            <EyeIcon className="size-6 absolute right-6 top-1/2 transform -translate-y-1/2 text-monday-gray" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswordConfirmation(
                                !showPasswordConfirmation
                              )
                            }
                          >
                            <EyeOffIcon className="size-6 absolute right-6 top-1/2 transform -translate-y-1/2 text-monday-gray" />
                          </button>
                        )}
                      </label>
                      {errors.password_confirmation && (
                        <p className="text-red-500">
                          {errors.password_confirmation.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setHasPhotoChanged(false);
                        // Reset form to original values
                        setValue("name", user.name);
                        setValue("phone", user.phone || "");
                        setValue("email", user.email);
                        setValue("password", "");
                        setValue("password_confirmation", "");
                        setImagePreview(
                          user.photo || "/assets/images/icons/gallery-grey.svg"
                        );
                      }}
                      className="btn btn-red font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!isFormDirty || isUpdating}
                      className="btn btn-primary font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Profile Display */}
                  <div className="flex items-center gap-6">
                    <div className="flex size-[120px] rounded-full bg-monday-background items-center justify-center overflow-hidden">
                      <img
                        src={
                          user.photo || "/assets/images/icons/gallery-grey.svg"
                        }
                        className="size-full object-cover"
                        alt={user.name}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="font-semibold text-2xl">{user.name}</p>
                      <p className="font-medium text-lg text-monday-gray">
                        {user.email}
                      </p>
                      {user.phone && (
                        <p className="font-medium text-lg text-monday-gray">
                          {user.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-monday-border pt-6">
                    <h3 className="font-semibold text-lg mb-4">
                      Account Details
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src="/assets/images/icons/profile-grey.svg"
                          className="flex size-6 shrink-0"
                          alt="icon"
                        />
                        <div className="flex flex-col">
                          <p className="font-medium text-sm text-monday-gray">
                            Full Name
                          </p>
                          <p className="font-semibold text-lg">{user.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <img
                          src="/assets/images/icons/sms-grey.svg"
                          className="flex size-6 shrink-0"
                          alt="icon"
                        />
                        <div className="flex flex-col">
                          <p className="font-medium text-sm text-monday-gray">
                            Email
                          </p>
                          <p className="font-semibold text-lg">{user.email}</p>
                        </div>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-3">
                          <img
                            src="/assets/images/icons/call-grey.svg"
                            className="flex size-6 shrink-0"
                            alt="icon"
                          />
                          <div className="flex flex-col">
                            <p className="font-medium text-sm text-monday-gray">
                              Phone
                            </p>
                            <p className="font-semibold text-lg">
                              {user.phone}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <img
                          src="/assets/images/icons/user-square-black.svg"
                          className="flex size-6 shrink-0"
                          alt="icon"
                        />
                        <div className="flex flex-col">
                          <p className="font-medium text-sm text-monday-gray">
                            Roles
                          </p>
                          <p className="font-semibold text-lg">
                            {user.roles?.join(", ") || "No roles assigned"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Actions */}
            <div className="flex flex-col w-full md:w-[400px] h-fit rounded-3xl p-[18px] gap-5 bg-white">
              <h3 className="font-semibold text-xl">Account Actions</h3>

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 btn btn-black w-full font-semibold bg-monday-red"
                >
                  <LogOut className="size-6" />
                  Logout
                </button>

                <div className="border-t border-monday-border pt-4">
                  <p className="font-semibold text-red-600 mb-2">Danger Zone</p>
                  <p className="font-medium text-sm text-monday-gray mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="flex items-center gap-3 btn w-full font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="size-6" />
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Account Confirmation Modal */}
      <PopupDeleteAccount
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteAccount}
        isDeleting={isDeleting}
        title="Delete Account"
        description="Are you absolutely sure you want to delete your account? This will:"
        confirmButtonText="Yes, Delete My Account"
      />
    </div>
  );
};

export default Settings;
