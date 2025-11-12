import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import { AxiosError } from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("password", formData.password);
      submitData.append(
        "password_confirmation",
        formData.password_confirmation
      );
      if (photo) {
        submitData.append("photo", photo);
      }

      await apiClient.post("/register", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Registration successful, redirect to login
      navigate("/login", {
        state: { message: "Registration successful! Please login." },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "Registration failed.";
        const errors = error.response?.data?.errors;

        if (errors) {
          const firstError = Object.values(errors)[0] as string[];
          setError(firstError?.[0] || errorMessage);
        } else {
          setError(errorMessage);
        }
      } else {
        setError("Unexpected error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-1 h-screen items-center">
      <div className="flex flex-col h-screen overflow-hidden rounded-tr-[32px] pl-[30px] pt-[46px] w-[685px] shrink-0 blue-gradient">
        <p className="font-semibold text-lg text-monday-lime-green-char">
          — Warehouse & Merchant Management
        </p>
        <p className="font-extrabold text-[42px] uppercase text-white mt-4 mb-[30px]">
          Join Us Today.
          <br />
          Start Managing Your Business.
        </p>
        <div className="flex flex-1 overflow-hidden rounded-tl-[20px]">
          <img
            src="/assets/images/backgrounds/bg-image-1.png"
            className="size-full object-cover object-left-top"
            alt="image"
          />
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-[435px] shrink-0 rounded-3xl gap-10 p-6 bg-white max-h-[90vh] overflow-y-hidden"
        >
          <div className="flex items-center gap-2 mx-auto">
            <img
              src="/assets/images/logos/warehouse.png"
              className="w-[50px] mx-auto"
              alt="logo"
            />
            <h1 className="font-bold text-3xl">Saturday</h1>
          </div>
          <div className="flex flex-col gap-[30px]">
            <div className="flex flex-col gap-3 text-center">
              <p className="font-semibold text-2xl">Create Your Account</p>
              <p className="font-medium text-monday-gray">
                Sign up to get started with your account!
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full">
              {/* Name Field */}
              <label className="group relative">
                <div className="h-full flex items-center pr-4 absolute transform left-6 border-monday-border">
                  <img
                    src="/assets/images/icons/user-grey.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                </div>
                <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:placeholder-shown]:top-[36px] group-focus-within:top-[25px] transition-300">
                  Your full name
                </p>
                <input
                  required
                  name="name"
                  onChange={handleInputChange}
                  type="text"
                  value={formData.name}
                  className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-6 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300"
                  placeholder={formData.name ? "full name" : ""}
                />
              </label>

              {/* Email Field */}
              <label className="group relative">
                <div className="h-full flex items-center pr-4 absolute transform left-6 border-monday-border">
                  <img
                    src="/assets/images/icons/sms-grey.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                </div>
                <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:placeholder-shown]:top-[36px] group-focus-within:top-[25px] transition-300">
                  Your email address
                </p>
                <input
                  required
                  name="email"
                  onChange={handleInputChange}
                  type="email"
                  value={formData.email}
                  className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-6 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300"
                  placeholder={formData.email ? "email address" : ""}
                />
              </label>

              {/* Phone Field */}
              <label className="group relative">
                <div className="h-full flex items-center pr-4 absolute transform left-6 border-monday-border">
                  <img
                    src="/assets/images/icons/call-grey.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                </div>
                <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:placeholder-shown]:top-[36px] group-focus-within:top-[25px] transition-300">
                  Your phone number
                </p>
                <input
                  required
                  name="phone"
                  onChange={handleInputChange}
                  type="tel"
                  value={formData.phone}
                  className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-6 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300"
                  placeholder={formData.phone ? "phone number" : ""}
                />
              </label>

              {/* Password Field */}
              <label className="group relative">
                <div className="h-full flex items-center pr-4 absolute transform left-6 border-monday-border">
                  <img
                    src="/assets/images/icons/lock-grey.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                </div>
                <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:placeholder-shown]:top-[36px] group-focus-within:top-[25px] transition-300">
                  Your password
                </p>
                <input
                  required
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleInputChange}
                  value={formData.password}
                  className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-16 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300 tracking-[0.3em]"
                  placeholder=""
                />
                <button
                  type="button"
                  className="absolute transform -translate-y-1/2 top-[50%] right-6"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-eye opacity-50"
                    >
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-eye-off opacity-50"
                    >
                      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                      <path d="m2 2 20 20" />
                    </svg>
                  )}
                </button>
              </label>

              {/* Password Confirmation Field */}
              <label className="group relative">
                <div className="h-full flex items-center pr-4 absolute transform left-6 border-monday-border">
                  <img
                    src="/assets/images/icons/lock-grey.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                </div>
                <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:placeholder-shown]:top-[36px] group-focus-within:top-[25px] transition-300">
                  Confirm password
                </p>
                <input
                  required
                  name="password_confirmation"
                  type={showPasswordConfirmation ? "text" : "password"}
                  onChange={handleInputChange}
                  value={formData.password_confirmation}
                  className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-16 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300 tracking-[0.3em]"
                  placeholder=""
                />
                <button
                  type="button"
                  className="absolute transform -translate-y-1/2 top-[50%] right-6"
                  onClick={() =>
                    setShowPasswordConfirmation(!showPasswordConfirmation)
                  }
                >
                  {showPasswordConfirmation ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-eye opacity-50"
                    >
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-eye-off opacity-50"
                    >
                      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                      <path d="m2 2 20 20" />
                    </svg>
                  )}
                </button>
              </label>

              {/* Photo Upload (Optional) */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="w-16 h-16 rounded-full border-2 border-monday-border flex items-center justify-center overflow-hidden bg-monday-gray-background">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src="/assets/images/icons/gallery-grey.svg"
                        className="w-8 h-8"
                        alt="upload"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-monday-gray">
                      Profile Photo (Optional)
                    </p>
                    <p className="font-normal text-xs text-monday-gray">
                      PNG, JPEG up to 2MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="px-4 py-2 rounded-full bg-monday-blue/10 text-monday-blue font-semibold text-sm cursor-pointer hover:bg-monday-blue/20 transition-300"
                  >
                    Choose File
                  </label>
                </label>
              </div>

              <p className="font-medium text-sm text-monday-gray">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-monday-blue hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full font-bold disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            {error && (
              <p className="text-monday-red text-sm text-center">{error}</p>
            )}
          </div>
        </form>
      </div>
    </main>
  );
};

export default Register;
