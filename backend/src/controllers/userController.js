import pool from "../db/index.js";

function getUserIdentity(req) {
  const id =
    req.user?.sub ??
    req.user?.id ??
    req.user?.userId ??
    req.user?.user_id ??
    null;
  const email = req.user?.email ?? null;
  return { id, email };
}

export async function getMe(req, res) {
  try {
    const { id, email } = getUserIdentity(req);
    if (!id && !email) {
      return res.status(401).json({ message: "User tidak valid" });
    }

    const whereClause = id ? "u.id = ?" : "u.email = ?";
    const param = id || email;

    const [rows] = await pool.execute(
      `SELECT 
         u.id,
         u.fullname,
         u.email,
         u.employee_id,
         u.avatar_url,
         r.id AS role_id,
         r.role_name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE ${whereClause}
       LIMIT 1`,
      [param]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const u = rows[0];

    return res.json({
      user: {
        id: u.id,
        fullname: u.fullname,
        full_name: u.fullname,
        email: u.email,
        employee_id: u.employee_id,
        avatar_url: u.avatar_url,
        role_id: u.role_id,
        role_name: u.role_name,
      },
    });
  } catch (err) {
    console.error("getMe error:", err);
    return res
      .status(500)
      .json({ message: "Gagal mengambil data user", error: err.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const { id, email } = getUserIdentity(req);
    if (!id && !email) {
      return res.status(401).json({ message: "User tidak valid" });
    }

    const whereClause = id ? "u.id = ?" : "u.email = ?";
    const param = id || email;

    const { full_name } = req.body;
    const avatarUrlFromFile = req.file
      ? `/uploads/avatars/${req.file.filename}`
      : null;

    const [rows] = await pool.execute(
      `SELECT 
         u.id,
         u.fullname,
         u.email,
         u.employee_id,
         u.avatar_url,
         r.id AS role_id,
         r.role_name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE ${whereClause}
       LIMIT 1`,
      [param]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const oldUser = rows[0];

    const updatedFullname =
      full_name !== undefined && full_name !== null && full_name !== ""
        ? full_name
        : oldUser.fullname;

    const updatedAvatarUrl =
      avatarUrlFromFile !== null ? avatarUrlFromFile : oldUser.avatar_url;

    await pool.execute(
      "UPDATE users SET fullname = ?, avatar_url = ? WHERE id = ?",
      [updatedFullname, updatedAvatarUrl, oldUser.id]
    );

    return res.json({
      user: {
        id: oldUser.id,
        fullname: updatedFullname,
        full_name: updatedFullname,
        email: oldUser.email,
        employee_id: oldUser.employee_id,
        avatar_url: updatedAvatarUrl,
        role_id: oldUser.role_id,
        role_name: oldUser.role_name,
      },
    });
  } catch (err) {
    console.error("updateProfile error:", err);
    return res
      .status(500)
      .json({ message: "Gagal update profile", error: err.message });
  }
}
