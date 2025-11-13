import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useRoleRedirect } from "../hooks/useRoleRedirect";
import { Link } from "react-router-dom";

const Login = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useRoleRedirect(); // 🔄 redirect handled by hook

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className="flex flex-1 h-screen items-center">
      <div className=" flex-col h-screen overflow-hidden rounded-tr-[32px] pl-[30px] pt-[46px] w-[685px] shrink-0 blue-gradient hidden xl:flex">
        <p className="font-semibold text-lg text-monday-lime-green-char">
          — Warehouse & Merchant Management
        </p>
        <p className="font-extrabold text-[42px] uppercase text-white mt-4 mb-[30px]">
          Control Stock.
          <br />
          Support Merchants. Grow Together.
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
          onSubmit={handleLogin}
          className="flex flex-col w-[435px] shrink-0 rounded-3xl gap-10 p-6 bg-white"
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
              <p className="font-semibold text-2xl">Hi! Welcome Back!</p>
              <p className="font-medium text-monday-gray">
                Login to your account to continue!
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <label className="group relative">
                <div className=" h-full flex items-center pr-4 absolute transform left-6  border-monday-border ">
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
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  value={email}
                  className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-6 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300"
                  placeholder={email ? "email address" : ""}
                />
              </label>
              <label className="group relative">
                <div className=" h-full flex items-center pr-4 absolute transform left-6 border-monday-border ">
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
                  id="passwordInput"
                  type={showPassword ? "text" : "password"}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-16 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300 tracking-[0.3em]"
                  placeholder=""
                />
                <button
                  id="togglePassword"
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
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-eye-icon lucide-eye opacity-50"
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
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-eye-off-icon lucide-eye-off opacity-50"
                    >
                      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                      <path d="m2 2 20 20" />
                    </svg>
                  )}
                </button>
              </label>
              <p className="font-medium text-sm text-monday-gray">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-monday-blue hover:underline"
                >
                  Register Account
                </Link>
              </p>
            </div>
            <button type="submit" className="btn btn-primary w-full font-bold">
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
