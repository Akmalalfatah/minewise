import React from 'react';

function ProfileSection() {
    return (
        <div data-layer="profile_section" className="ProfileSection w-[105px] h-[77px] px-6 py-3 bg-white rounded-[50px] inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
            <div data-layer="profile_container" className="ProfileContainer self-stretch inline-flex justify-center items-center gap-[18px]">
                <div data-layer="icon_expand_down" className="IconExpandDown w-1.5 h-3 origin-top-left -rotate-90 border-2 border-black" src="/icons/icon_expand_down.png" />
                <img data-layer="profile_picture" className="ProfilePicture size-[57px] rounded-full" src="https://placehold.co/57x57" />
            </div>
        </div>
    );
}

export default ProfileSection;