import React from "react";

function ProfileCard({
profileName,
profileEmail,
profileImage,
employeeId,
role,
}) {
return (
<div className="w-96 h-72 px-7 py-8 relative shadow-[0px_0px_30px_0px_rgba(0,0,0,0.10)] inline-flex flex-col justify-center items-center gap-4">
    <div className="w-96 h-72 absolute bg-white rounded-3xl left-0 top-0" />

    <div className="flex flex-col justify-center items-start gap-4 relative">
    <div className="inline-flex justify-start items-center gap-4">
        <img
        className="w-16 h-16 rounded-full"
        src={profileImage}
        alt="profile"
        />

        <div className="w-48 inline-flex flex-col justify-start items-start gap-2">
        <div className="inline-flex justify-start items-center gap-2">
            <div className="text-black text-xl font-semibold font-['Inter']">
            {profileName}
            </div>

            <img
            className="w-5 h-5"
            src="src/icons/icon_verified.png"
            alt="verified"
            />
        </div>

        <div className="text-stone-500 text-sm font-normal font-['Inter']">
            {profileEmail}
        </div>
        </div>
    </div>

    <div className="w-96 h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-stone-300"></div>

    <div className="w-96 flex flex-col justify-start items-end gap-6">
        <div className="w-full inline-flex justify-between items-center">
        <div className="text-stone-500 text-sm font-normal font-['Inter']">
            Employee ID
        </div>
        <div className="text-black text-sm font-semibold font-['Inter']">
            {employeeId}
        </div>
        </div>

        <div className="w-full inline-flex justify-between items-center">
        <div className="text-stone-500 text-sm font-normal font-['Inter']">
            Roles
        </div>
        <div className="text-black text-sm font-semibold font-['Inter']">
            {role}
        </div>
        </div>

        <div className="w-24 h-7 px-3.5 py-2.5 bg-red-700 rounded-[5px] inline-flex justify-center items-center">
        <div className="text-white text-sm font-semibold font-['Inter']">
            Sign Out
        </div>
        </div>
    </div>
    </div>
</div>
);
}

export default ProfileCard;
