import React from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../store/userStore";

function ProfileSection({ profileImage }) {
  const navigate = useNavigate();
  const clearAuth = userStore((state) => state.clearAuth);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const imageSrc = profileImage || "https://placehold.co/57x57";

  return (
    <section
      data-layer="profile_section"
      aria-label="Profile quick actions"
      className="ProfileSection w-[105px] h-[77px] px-6 py-3 bg-white rounded-[50px] inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden"
    >
      <div
        data-layer="profile_container"
        className="ProfileContainer self-stretch inline-flex justify-center items-center gap-[18px]"
      >
        <img
          data-layer="icon_expand_down"
          className="IconExpandDown w-1.5 h-3 origin-top-left -rotate-90"
          src="/icons/icon_expand_down.png"
          alt="Profile menu indicator"
        />

        {/* Klik foto profile = logout */}
        <img
          data-layer="profile_picture"
          className="ProfilePicture size-[57px] rounded-full cursor-pointer"
          src={imageSrc}
          alt="User profile picture"
          onClick={handleLogout}
          title="Click to logout"
        />
      </div>
    </section>
  );
}

export default ProfileSection;
