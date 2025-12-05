import React, { useState, useEffect } from "react";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../store/userStore";

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
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid");
      return;
    }

    try {
      const res = await authService.login(email, password);

      if (!res) {
        setError("Login gagal, periksa kembali email dan password");
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
      className="Loginpage w-[1440px] h-[1024px] relative bg-[#0048ff] overflow-hidden"
    >
      {/* Background is decorative, so aria-hidden and empty alt */}
      <img
        data-layer="background_auth"
        className="BackgroundAuth w-[1440px] h-[1024px] left-0 top-0 absolute"
        src="/icons/background_auth.png"
        alt=""
        aria-hidden="true"
      />

      <section
        data-layer="auth_left"
        className="AuthLeft w-[643px] h-[1024px] left-0 top-0 absolute"
        aria-label="Login section"
      >
        <form
          onSubmit={handleLogin}
          className="AuthTextContent w-[442px] left-[100.50px] top-[220px] absolute inline-flex flex-col justify-start items-center gap-[63px]"
          aria-describedby={error ? "login-error" : undefined}
        >
          {/* Header / Hero Text */}
          <header className="Headline flex flex-col justify-start items-center gap-2.5">
            <h1 className="HeadlineTitle text-center">
              <span className="text-[#030303] text-4xl font-semibold">
                WELCOME BACK! TO{" "}
              </span>
              <span className="text-[#ff7b54] text-4xl font-semibold">
                MINEWISE
              </span>
            </h1>

            <p className="HeadlineSubtitle text-center text-[#626263] text-lg font-normal">
              Welcome back! Please enter your details.
            </p>
          </header>

          {/* Form Fields */}
          <div className="FormContainer w-[315px] flex flex-col justify-start items-center gap-[21px]">
            <div className="InputsFieldsContainer self-stretch flex flex-col justify-start items-start gap-[22px]">
              {/* Email */}
              <div className="EmailForm self-stretch flex flex-col justify-start items-start gap-1.5">
                <label
                  htmlFor="email"
                  className="EmailLabel self-stretch text-[#181818] text-base font-semibold"
                >
                  Email
                </label>
                <div className="EmailInputWrapper self-stretch h-[41.31px] px-[21px] py-[11px] rounded-xl outline outline-1 outline-[#bdbdbd] inline-flex items-center">
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

              {/* Password */}
              <div className="PasswordForm self-stretch flex flex-col justify-start items-start gap-[9px]">
                <label
                  htmlFor="password"
                  className="PasswordLabel self-stretch text-[#181818] text-base font-semibold"
                >
                  Password
                </label>
                <div className="PasswordInputWrapper self-stretch h-[41.31px] px-4 py-[11px] rounded-xl outline outline-1 outline-[#bdbdbd] inline-flex items-center">
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
                className="text-red-500 text-xs self-start"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="SignInButtonWrapper self-stretch flex flex-col justify-start items-center gap-[18px]">
              <button
                type="submit"
                className="SignInButtonBox self-stretch h-[41.31px] px-[131px] py-2 bg-[#ff7b54] rounded-xl inline-flex justify-center items-center"
              >
                <span className="text-white text-sm font-semibold">
                  Sign in
                </span>
              </button>

              <p className="SignUpText self-stretch text-center text-xs">
                <span className="text-[#595959]">
                  Don’t have an account?
                </span>
                <button
                  type="button"
                  className="text-[#ea454c] cursor-pointer ml-1"
                  onClick={() => navigate("/register")}
                >
                  Sign up for free!
                </button>
              </p>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
