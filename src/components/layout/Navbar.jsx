import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Mine Planner", path: "/mine-planner" },
    { label: "Shipping Planner", path: "/shipping-planner" },
    { label: "AI Chatbox", path: "/chat" },
    { label: "Reports", path: "/report" },
    { label: "Simulation Analysis", path: "/simulation-analysis" }
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <nav
      data-layer="global_navbar"
      aria-label="Main navigation"
      className="GloballNavbar w-[944px] px-8 py-6 bg-white rounded-[50px] inline-flex flex-col justify-center items-center gap-3"
    >
      <div
        data-layer="navbar_container"
        className="NavbarContainer self-stretch inline-flex justify-between items-center"
      >
        {/* Logo */}
        <button
          type="button"
          data-layer="navbar_logo"
          onClick={() => navigate("/dashboard")}
          className="NavbarLogo justify-start text-[#ff7b54] text-2xl font-semibold cursor-pointer"
        >
          MineWise
        </button>

        {/* Menu List */}
        <ul
          data-layer="navbar_menu_list"
          className="NavbarMenuList w-[683px] flex justify-center items-center gap-[58px]"
        >
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                type="button"
                onClick={() => navigate(item.path)}
                className={`cursor-pointer text-base font-normal ${
                  isActive(item.path)
                    ? "text-black font-semibold"
                    : "text-[#666666]"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
