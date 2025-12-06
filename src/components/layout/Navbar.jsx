import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationSection from "./NotificationSection";
import ProfileSection from "./ProfileSection";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Simulation Analysis", path: "/simulation-analysis" },
    { label: "AI Chatbox", path: "/chat" },
    { label: "Overview", path: "/overview" },
    { label: "Reports", path: "/report" },
  ];

  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  return (
    <nav
      aria-label="Main navigation"
      className="w-full bg-white rounded-full py-4 px-8 shadow-sm flex items-center justify-between"
    >
      {/* Left: Logo */}
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="text-[#ff7b54] text-2xl font-semibold"
      >
        MineWise
      </button>

      {/* Center: Menu */}
      <ul className="flex items-center gap-10">
        {menuItems.map((item) => (
          <li key={item.path}>
            <button
              type="button"
              onClick={() => navigate(item.path)}
              className={`text-base transition ${
                isActive(item.path)
                  ? "text-black font-semibold"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Right: Notification + Profile */}
      <div className="flex items-center gap-4">
        <NotificationSection />
        <ProfileSection />
      </div>
    </nav>
  );
}

export default Navbar;
