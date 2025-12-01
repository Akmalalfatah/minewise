import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Simulation Analysis", path: "/simulation-analysis" },
        { label: "AI Chatbox", path: "/ai-chatbox" },
        { label: "Overview", path: "/overview" },
        { label: "Reports", path: "/reports" }
    ];

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + "/");
    };

    return (
        <div data-layer="globall_navbar"
            className="GloballNavbar w-[944px] px-8 py-6 bg-white rounded-[50px] inline-flex flex-col justify-center items-center gap-3"
        >
            <div data-layer="navbar_container"
                className="NavbarContainer self-stretch inline-flex justify-between items-center"
            >
                <div
                    data-layer="navbar_logo"
                    className="NavbarLogo justify-start text-[#ff7b54] text-2xl font-semibold cursor-pointer"
                    onClick={() => navigate("/dashboard")}
                >
                    MineWise
                </div>

                <div
                    data-layer="navbar_menu_list"
                    className="NavbarMenuList w-[683px] flex justify-center items-center gap-[58px]"
                >
                    {menuItems.map((item) => (
                        <div
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`cursor-pointer text-base font-normal
                                ${isActive(item.path) ? "text-black font-semibold" : "text-[#666666]"}`}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
