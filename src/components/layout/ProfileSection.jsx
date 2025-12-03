import React from "react";
<<<<<<< HEAD
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
        <div
            data-layer="profile_section"
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
                    alt="expand"
                />

                {/* Klik foto profile = logout */}
                <img
                    data-layer="profile_picture"
                    className="ProfilePicture size-[57px] rounded-full cursor-pointer"
                    src={imageSrc}
                    alt="profile"
                    onClick={handleLogout}
                    title="Click to logout"
                />
            </div>
        </div>
    );
=======

function ProfileSection({ profileImage }) {
return (
<div
    data-layer="profile_section"
    className="ProfileSection w-[105px] h-[77px] px-6 py-3 bg-white rounded-[50px] inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden"
>
    <div
    data-layer="profile_container"
    className="ProfileContainer self-stretch inline-flex justify-center items-center gap-[18px]"
    >
    <img
        data-layer="icon_expand_down"
        className="IconExpandDown w-1.5 h-3 origin-top-left -rotate-90"
        src="src/icons/icon_expand_down.png"
        alt="expand"
    />

    <img
        data-layer="profile_picture"
        className="ProfilePicture size-[57px] rounded-full"
        src={profileImage}
        alt="profile"
    />
    </div>
</div>
);
>>>>>>> athira-febe
}

export default ProfileSection;
