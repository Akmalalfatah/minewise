import apiClient from "./apiClient";

export async function updateProfile({ full_name, avatarFile }) {
  const formData = new FormData();
  if (full_name !== undefined && full_name !== null) {
    formData.append("full_name", full_name);
  }
  if (avatarFile) {
    formData.append("avatar", avatarFile);
  }

  const res = await apiClient.put("/users/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.user;
}
