import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationSection from "./NotificationSection";
import NotificationCard from "./NotificationCard";
import ProfileSection from "./ProfileSection";
import { notificationStore } from "../../store/notificationStore";
import { downloadReport } from "../../services/reportService";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const notifications = notificationStore((state) => state.notifications);
  const markAllRead = notificationStore((state) => state.markAllRead);
  const clearNotifications = notificationStore((state) => state.clearNotifications);
  const removeNotification = notificationStore((state) => state.removeNotification);

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

  const handleCheckNotif = async (notif) => {
    try {
      if (notif?.payload) {
        const { blob } = await downloadReport(notif.payload);
        const pdfBlob = new Blob([blob], { type: "application/pdf" });
        const url = window.URL.createObjectURL(pdfBlob);
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        navigate("/report");
      }

      if (notif?.id) {
        removeNotification(notif.id);
      }
    } catch (err) {
      navigate("/report");
    } finally {
      setOpenNotif(false);
    }
  };

  const handleClearAll = () => {
    clearNotifications();
  };

  return (
    <div className="w-full px-8 pt-8 bg-[#f5f5f7]">
      <nav className="w-full flex items-center gap-4">

        <div className="bg-white rounded-[32px] py-4 px-8 flex items-center gap-12">
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
                  className={`text-base ${isActive(item.path)
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
        </div>

        <div className="bg-white rounded-full p-2 flex items-center">
          <div className="relative">
            <NotificationSection onClick={handleToggleNotif} />

            {openNotif && (
              <div className="absolute top-full mt-3 z-50">
                <NotificationCard
                  notifications={notifications}
                  onCheck={handleCheckNotif}
                  onClearAll={handleClearAll}
                />
              </div>
            )}
          </div>
        </div>

        <div className="ml-auto bg-white rounded-full px-2 py-1">
          <ProfileSection />
        </div>

      </nav>
    </div>
  );

}

export default Navbar;
