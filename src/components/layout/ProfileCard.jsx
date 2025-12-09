import React, { useState } from "react";
import { userStore } from "../../store/userStore";
import { updateProfile } from "../../services/userService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function ProfileCard({
  profileName,
  profileEmail,
  profileImage,
  employeeId,
  role,
  onSignOut,
}) {
  const { user, setUser } = userStore();

  const initialName = user?.full_name || profileName || "";
  const initialEmail = user?.email || profileEmail || "";
  const initialEmployeeId = user?.employee_id || employeeId || "-";
  const initialRole = user?.role || role || "-";

  const [fullName, setFullName] = useState(initialName);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const avatarSrc =
    previewUrl ||
    (user?.avatar_url
      ? `${API_BASE_URL}${user.avatar_url}`
      : profileImage || "/icons/icon_default_profile.png");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedUser = await updateProfile({
        full_name: fullName,
        avatarFile,
      });
      setUser(updatedUser);
      setIsEditing(false);
      setAvatarFile(null);
    } catch (err) {
      alert("Gagal update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setPreviewUrl(null);
    setFullName(initialName);
  };

  return (
    <section
      className="w-96 px-7 py-8 relative shadow-[0px_0px_30px_0px_rgba(0,0,0,0.10)] flex flex-col items-start gap-4 bg-white rounded-3xl"
      aria-label="User profile card"
    >
      <div className="flex flex-col justify-start items-start gap-4 w-full">
        <header className="inline-flex justify-start items-center gap-4 w-full">
          <img
            className="w-16 h-16 rounded-full object-cover"
            src={avatarSrc}
            alt={`${fullName || "User"} profile`}
          />

          <div className="flex-1 inline-flex flex-col gap-2">
            <div className="inline-flex justify-between items-center gap-2">
              <h2 className="text-black text-xl font-semibold font-['Inter'] truncate">
                {fullName || initialName || "User"}
              </h2>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="w-5 h-5 flex items-center justify-center"
              >
                <img
                  className="w-5 h-5"
                  src="/icons/icon_edit.png"
                  alt="edit account icon"
                />
              </button>
            </div>

            <p className="text-stone-500 text-sm font-normal font-['Inter'] truncate">
              {initialEmail}
            </p>
          </div>
        </header>

        {isEditing && (
          <form
            className="w-full flex flex-col gap-4 mt-1"
            onSubmit={handleSave}
          >
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-stone-700 font-['Inter']">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-['Inter']"
                placeholder="Nama lengkap"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-stone-700 font-['Inter']">
                Profile Picture
              </span>
              <div className="flex items-center gap-2">
                <label className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-xs font-['Inter'] text-stone-800 rounded-md border border-stone-300 cursor-pointer">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <span className="text-xs font-['Inter'] text-stone-500 truncate max-w-[160px]">
                  {avatarFile?.name || "No file chosen"}
                </span>
              </div>
              <span className="text-[11px] font-['Inter'] text-stone-400">
                JPG atau PNG, maksimal 2MB
              </span>
            </div>

            <div className="w-full flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs font-['Inter'] border border-stone-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-3 py-1.5 text-xs font-['Inter'] bg-gray-900 text-white rounded-md disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}

        <hr className="w-full h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-stone-300" />

        <div className="w-full flex flex-col justify-start items-end gap-6">
          <dl className="w-full inline-flex justify-between items-center">
            <dt className="text-stone-500 text-sm font-normal font-['Inter']">
              Employee ID
            </dt>
            <dd className="text-black text-sm font-semibold font-['Inter']">
              {initialEmployeeId}
            </dd>
          </dl>

          <dl className="w-full inline-flex justify-between items-center">
            <dt className="text-stone-500 text-sm font-normal font-['Inter']">
              Roles
            </dt>
            <dd className="text-black text-sm font-semibold font-['Inter'] capitalize">
              {initialRole}
            </dd>
          </dl>

          <button
            type="button"
            onClick={onSignOut}
            className="w-24 h-7 px-3.5 py-2.5 bg-red-700 rounded-[5px] inline-flex justify-center items-center"
          >
            <span className="text-white text-sm font-semibold font-['Inter']">
              Sign Out
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProfileCard;
