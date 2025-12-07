import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../store/userStore";
import ProfileCard from "./ProfileCard";

function ProfileSection({ profileImage }) {
  const navigate = useNavigate();
  const { user, clearAuth, fetchCurrentUser, isLoadingProfile } = userStore();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) fetchCurrentUser();
  }, [user, fetchCurrentUser]);

  const imageSrc =
    profileImage || user?.avatarUrl || "https://placehold.co/28x28";

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const profileName = user?.fullname || "User Name";
  const profileEmail = user?.email || "user@example.com";
  const employeeId = user?.employee_id || "-";
  const role = user?.role_name || "User";

  return (
    <div className="relative">
      <div
        onClick={handleToggle}
        className="h-9 px-3 bg-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-200 flex items-center gap-2 cursor-pointer"
      >
        <img
          src="/icons/icon_expand_down.png"
          alt=""
          className="w-2 h-2 opacity-60"
        />

        <div className="w-7 h-7 rounded-full overflow-hidden">
          <img
            src={imageSrc}
            alt="User avatar"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-3 z-50">
          {isLoadingProfile ? (
            <div className="w-96 h-32 flex items-center justify-center bg-white rounded-3xl shadow">
              <span className="text-sm text-stone-500">Loading profile...</span>
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
