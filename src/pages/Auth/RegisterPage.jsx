import React, { useState, useEffect } from "react";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../store/userStore";

function RegisterPage() {
    const navigate = useNavigate();
    const isAuthenticated = userStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) navigate("/dashboard");
    }, [isAuthenticated, navigate]);

    const [fullName, setFullName] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleRegister(e) {
        e.preventDefault();

        setError("");

        if (!fullName || !employeeId || !email || !password) {
            setError("Semua field wajib diisi");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Format email tidak valid");
            return;
        }
        if (password.length < 6) {
            setError("Password minimal 6 karakter");
            return;
        }

        try {
            const res = await authService.register({
                name: fullName,
                employee_id: employeeId,
                email,
                password
            });

            if (!res) {
                setError("Registrasi gagal. Coba lagi.");
                return;
            }

            navigate("/login");
        } catch (err) {
            console.error(err);
            setError("Terjadi kesalahan saat registrasi. Coba lagi nanti.");
        }
    }

    return (
        <div data-layer="RegisterPage" className="Registerpage w-[1440px] h-[1024px] relative bg-[#eff1f6] overflow-hidden">
            <img className="BackgroundRightImgAuth w-[797px] h-[1024px] left-[643px] top-0 absolute" src="src/icons/background_right_img_auth.png" />
            <div className="AuthLeft w-[644px] h-[1023.21px] left-0 top-0 absolute">
                <img className="BackgroundLeftImgAuth2 w-[643px] h-[1024px] left-[1.50px] top-[-0.39px] absolute" src="src/icons/background_left_img_auth.png" />

                <form onSubmit={handleRegister} className="AuthTextContent w-[442px] left-[101px] top-[163px] absolute inline-flex flex-col justify-start items-center gap-[63px]">

                    <div className="Headline flex flex-col items-center gap-2.5">
                        <div className="HeadlineTitle text-center">
                            <span className="text-[#030303] text-4xl font-semibold">WELCOME TO </span>
                            <span className="text-[#ff7b54] text-4xl font-semibold">MINEWISE</span>
                        </div>
                        <div className="HeadlineSubtitle text-center text-[#626263] text-lg font-normal">This is your first time? Please enter your details!</div>
                    </div>

                    <div className="FormContainer w-[315px] flex flex-col items-center gap-[21px]">
                        <div className="InputsFieldsContainer flex flex-col gap-[22px] self-stretch">

                            <div className="FullNameForm flex flex-col gap-1.5">
                                <div className="NameLabel text-[#181818] text-base font-semibold">Full Name</div>
                                <div className="NameInputWrapper h-[41.31px] px-[21px] py-[11px] rounded-xl outline outline-1 outline-[#bdbdbd] flex items-center">
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full text-[#626263] text-sm bg-transparent outline-none"
                                    />
                                </div>
                            </div>

                            <div className="EmployeeIdForm flex flex-col gap-1.5">
                                <div className="EmployeeForm text-[#181818] text-base font-semibold">Employee ID</div>
                                <div className="EmployeeInputWrapper h-[41.31px] px-[21px] py-[11px] rounded-xl outline outline-1 outline-[#bdbdbd] flex items-center">
                                    <input
                                        type="text"
                                        value={employeeId}
                                        onChange={(e) => setEmployeeId(e.target.value)}
                                        placeholder="Enter your ID"
                                        className="w-full text-[#626263] text-sm bg-transparent outline-none"
                                    />
                                </div>
                            </div>

                            <div className="EmailForm flex flex-col gap-1.5">
                                <div className="EmailLabel text-[#181818] text-base font-semibold">Email</div>
                                <div className="EmailInputWrapper h-[41.31px] px-[21px] py-[11px] rounded-xl outline outline-1 outline-[#bdbdbd] flex items-center">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full text-[#626263] text-sm bg-transparent outline-none"
                                    />
                                </div>
                            </div>

                            <div className="PasswordForm flex flex-col gap-[9px]">
                                <div className="PasswordLabel text-[#181818] text-base font-semibold">Password</div>
                                <div className="PasswordInputWrapper h-[41.31px] px-4 py-[11px] rounded-xl outline outline-1 outline-[#bdbdbd] flex items-center">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full text-[#626263] text-sm bg-transparent outline-none"
                                    />
                                </div>
                            </div>

                        </div>

                        {error && <div className="text-red-500 text-xs self-start">{error}</div>}

                        <div className="SignInButtonWrapper self-stretch flex flex-col items-center gap-[18px]">
                            <button type="submit" className="SignInButtonBox h-[41.31px] w-full bg-[#ff7b54] rounded-xl flex justify-center items-center">
                                <div className="text-white text-sm font-semibold">Sign Up</div>
                            </button>

                            <div className="SignUpText text-center">
                                <span className="text-[#595959] text-xs">You have an account?</span>
                                <span
                                    className="text-[#ea454c] text-xs cursor-pointer"
                                    onClick={() => navigate("/login")}
                                >
                                    {" "}Sign in!
                                </span>
                            </div>

                        </div>

                    </div>

                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
