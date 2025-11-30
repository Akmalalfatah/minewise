import React, { useState, useEffect } from "react";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../store/userStore";

function LoginPage() {
    const navigate = useNavigate();
    const isAuthenticated = userStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) navigate("/dashboard");
    }, [isAuthenticated]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e) {
        e.preventDefault();
        if (!email || !password) {
            setError("Email dan password wajib diisi");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Format email tidak valid");
            return;
        }
        const res = await authService.login(email, password);
        if (res) navigate("/dashboard");
    }

    return (
        <div data-layer="LoginPage" className="Loginpage w-[1440px] h-[1024px] relative bg-[#0048ff] overflow-hidden">
            <img data-layer="background_right_img_auth" className="BackgroundRightImgAuth w-[797px] h-[1024px] left-[643px] top-0 absolute" src="src/icons/background_right_img_auth.png" />
            <div data-layer="auth_left" className="AuthLeft w-[643px] h-[1024px] left-0 top-0 absolute">
                <img data-layer="background_left_img_auth" className="BackgroundLeftImgAuth1 w-[643px] h-[1024px] left-0 top-0 absolute" src="src/icons/background_left_img_auth.png" />

                <form onSubmit={handleLogin} className="AuthTextContent w-[442px] left-[100.50px] top-[220px] absolute inline-flex flex-col justify-start items-center gap-[63px]">

                    <div className="Headline size- flex flex-col justify-start items-center gap-2.5">
                        <div className="HeadlineTitle text-center justify-start">
                            <span className="text-[#030303] text-4xl font-semibold">WELCOME BACK! TO </span>
                            <span className="text-[#ff7b54] text-4xl font-semibold">MINEWISE</span>
                        </div>
                        <div className="HeadlineSubtitle text-center justify-start text-[#626263] text-lg font-normal">Welcome back! Please enter your details.</div>
                    </div>

                    <div className="FormContainer w-[315px] flex flex-col justify-start items-center gap-[21px]">

                        <div className="InputsFieldsContainer self-stretch flex flex-col justify-start items-start gap-[22px]">

                            <div className="EmailForm self-stretch flex flex-col justify-start items-start gap-1.5">
                                <div className="EmailLabel self-stretch text-[#181818] text-base font-semibold">Email</div>
                                <div className="EmailInputWrapper self-stretch h-[41.31px] px-[21px] py-[11px] rounded-xl outline outline-1 outline-[#bdbdbd] inline-flex items-center">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full text-[#626263] text-sm font-normal outline-none bg-transparent"
                                    />
                                </div>
                            </div>

                            <div className="PasswordForm self-stretch flex flex-col justify-start items-start gap-[9px]">
                                <div className="PasswordLabel self-stretch text-[#181818] text-base font-semibold">Password</div>
                                <div className="PasswordInputWrapper self-stretch h-[41.31px] px-4 py-[11px] rounded-xl outline outline-1 outline-[#bdbdbd] inline-flex items-center">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full text-[#626263] text-sm font-normal outline-none bg-transparent"
                                    />
                                </div>
                            </div>

                        </div>

                        {error && <div className="text-red-500 text-xs self-start">{error}</div>}

                        <div className="SignInButtonWrapper self-stretch flex flex-col justify-start items-center gap-[18px]">
                            <button type="submit" className="SignInButtonBox self-stretch h-[41.31px] px-[131px] py-2 bg-[#ff7b54] rounded-xl inline-flex justify-center items-center">
                                <div className="text-white text-sm font-semibold">Sign in</div>
                            </button>

                            <div className="SignUpText self-stretch text-center">
                                <span className="text-[#595959] text-xs">Don’t have an account?</span>
                                <span
                                    className="text-[#ea454c] text-xs cursor-pointer"
                                    onClick={() => navigate("/register")}
                                >
                                    Sign up for free!
                                </span>
                            </div>

                        </div>

                    </div>

                </form>
            </div>
        </div>
    );
}

export default LoginPage;
