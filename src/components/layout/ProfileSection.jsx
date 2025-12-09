import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../store/userStore";
import ProfileCard from "./ProfileCard";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function ProfileSection({ profileImage }) {
  const navigate = useNavigate();
  const { user, clearAuth, fetchCurrentUser, isLoadingProfile } = userStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user && fetchCurrentUser) {
      fetchCurrentUser();
    }
  }, [user, fetchCurrentUser]);

  const imageSrc =
    user?.avatar_url
      ? `${API_BASE_URL}${user.avatar_url}`
      : profileImage || "/icons/icon_default_profile.png";

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const profileName =
    user?.fullname || user?.full_name || "User Name";
  const profileEmail = user?.email || "user@example.com";
  const employeeId = user?.employee_id || "-";
  const role = user?.role_name || "User";

  return (
    <div className="relative">
      <div
        onClick={handleToggle}
        className="h-14 bg-white rounded-full flex items-center gap-2 cursor-pointer"
      >
        <div className="w-11 h-11 rounded-full overflow-hidden">
          <img
            src={imageSrc}
            alt="User avatar"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <img
          src="/icons/icon_expand_down.png"
          alt="expand"
          className="w-3 h-2"
        />
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-3 z-50">
          {isLoadingProfile ? (
            <div className="w-96 h-32 flex items-center justify-center bg-white rounded-3xl shadow">
              <span className="text-sm text-stone-500">
                Loading profile...
              </span>
            </div>
          ) : (
            <ProfileCard
              profileName={profileName}
              profileEmail={profileEmail}
              profileImage={imageSrc}
              employeeId={employeeId}
              role={role}
              onSignOut={handleLogout}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileSection;
