import React, { useState, useEffect } from "react";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../store/userStore";

const ROLE_OPTIONS = [
  { value: "mine_planner", label: "Mine Planner" },
  { value: "shipping_planner", label: "Shipping Planner" },
];

function LoginPage() {
  const navigate = useNavigate();
  const isAuthenticated = userStore((state) => state.isAuthenticated);

  const setToken = userStore((state) => state.setToken);
  const setUser = userStore((state) => state.setUser);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setError("");

    if (!email || !password || !role) {
      setError("Email, password, dan role wajib diisi");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid");
      return;
    }

    try {
      const res = await authService.login(email, password, role);

      if (!res) {
        setError("Login gagal, periksa kembali email, password, dan role");
        return;
      }

      if (res.accessToken) {
        setToken(res.accessToken, res.refreshToken);
      }
      if (res.user) {
        setUser(res.user);
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat login. Coba lagi nanti.");
    }
  }

  return (
    <main
      data-layer="LoginPage"
      className="relative min-h-screen w-full overflow-hidden bg-white"
    >
      {/* Background full screen */}
      <img
        data-layer="background_auth"
        className="BackgroundAuth absolute inset-0 w-full h-full object-cover"
        src="/icons/background_auth.png"
        alt=""
        aria-hidden="true"
      />

      {/* Area kiri untuk form */}
      <section
        data-layer="auth_left"
        className="absolute inset-y-0 left-0 flex items-center"
        aria-label="Login section"
      >
        {/* padding kiri kira-kira mengikuti desain Figma */}
        <div className="pl-[120px]">
          <form
            onSubmit={handleLogin}
            className="AuthTextContent w-[360px] flex flex-col gap-10"
            aria-describedby={error ? "login-error" : undefined}
          >
            {/* Header / Hero Text */}
            <header className="Headline flex flex-col items-start gap-2.5 text-left">
              <h1 className="HeadlineTitle">
                <span className="text-[#030303] text-4xl font-semibold">
                  WELCOME BACK! TO{" "}
                </span>
                <span className="text-[#ff7b54] text-4xl font-semibold">
                  MINEWISE
                </span>
              </h1>

              <p className="HeadlineSubtitle text-[#626263] text-base font-normal">
                Welcome back! Please enter your details.
              </p>
            </header>

            {/* Form Fields */}
            <div className="FormContainer w-full flex flex-col gap-5">
              <div className="InputsFieldsContainer w-full flex flex-col gap-5">
                {/* Email */}
                <div className="EmailForm w-full flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="EmailLabel text-[#181818] text-sm font-semibold"
                  >
                    Email
                  </label>
                  <div className="EmailInputWrapper h-[41.31px] px-[21px] py-[11px] rounded-xl outline outline-1 outline-[#bdbdbd] inline-flex items-center bg-white">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full text-[#626263] text-sm font-normal outline-none bg-transparent"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="RoleForm w-full flex flex-col gap-1.5">
                  <label
                    htmlFor="role"
                    className="RoleLabel text-[#181818] text-sm font-semibold"
                  >
                    Role
                  </label>
                  <div className="RoleSelectWrapper h-[41.31px] px-[21px] py-[11px] rounded-xl outline outline-1 outline-[#bdbdbd] inline-flex items-center bg-white">
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full text-[#626263] text-sm font-normal outline-none bg-transparent"
                      required
                    >
                      <option value="" disabled>
                        Select your role
                      </option>
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div className="PasswordForm w-full flex flex-col gap-1.5">
                  <label
                    htmlFor="password"
                    className="PasswordLabel text-[#181818] text-sm font-semibold"
                  >
                    Password
                  </label>
                  <div className="PasswordInputWrapper h-[41.31px] px-4 py-[11px] rounded-xl outline outline-1 outline-[#bdbdbd] inline-flex items-center bg-white">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full text-[#626263] text-sm font-normal outline-none bg-transparent"
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div
                  id="login-error"
                  className="text-red-500 text-xs"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="SignInButtonWrapper w-full flex flex-col gap-3">
                <button
                  type="submit"
                  className="SignInButtonBox w-full h-[41.31px] bg-[#ff7b54] rounded-xl inline-flex justify-center items-center"
                >
                  <span className="text-white text-sm font-semibold">
                    Sign in
                  </span>
                </button>

                <p className="w-full text-xs text-[#595959]">
                  MineWise login is for internal use only. Please contact the
                  system administrator if you need an account or role update.
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
