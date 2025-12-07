import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationSection from "./NotificationSection";
import NotificationCard from "./NotificationCard";
import ProfileSection from "./ProfileSection";
import { notificationStore } from "../../store/notificationStore";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const notifications = notificationStore((state) => state.notifications);
  const markAllRead = notificationStore((state) => state.markAllRead);

  const [openNotif, setOpenNotif] = useState(false);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleToggleNotif = () => {
    const willOpen = !openNotif;
    setOpenNotif(willOpen);
    if (willOpen) {
      markAllRead();
    }
  };

  const handleCheckNotif = () => {
    navigate("/report");
    setOpenNotif(false);
  };

  return (
    <nav className="w-full bg-white rounded-full py-4 px-8 shadow-sm flex items-center justify-between relative">
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="text-[#ff7b54] text-2xl font-semibold"
      >
        MineWise
      </button>

      <ul className="flex items-center gap-10">
        {[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Simulation Analysis", path: "/simulation-analysis" },
          { label: "AI Chatbox", path: "/chat" },
          { label: "Overview", path: "/overview" },
          { label: "Reports", path: "/report" },
        ].map((item) => (
          <li key={item.path}>
            <button
              className={`text-base ${
                isActive(item.path)
                  ? "text-black font-semibold"
                  : "text-gray-500 hover:text-black"
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        <div className="relative">
          <NotificationSection onClick={handleToggleNotif} />

          {openNotif && (
            <div className="absolute right-0 top-full mt-3 z-50">
              <NotificationCard
                notifications={notifications}
                onCheck={handleCheckNotif}
              />
            </div>
          )}
        </div>

        <ProfileSection />
      </div>
    </nav>
  );
}

export default Navbar;
