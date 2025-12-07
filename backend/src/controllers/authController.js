import bcrypt from "bcryptjs";
import db from "../db/index.js";

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email dan password wajib diisi" });
  }

  try {
    const [rows] = await db.query(
      `SELECT 
          u.id,
          u.fullname,
          u.email,
          u.password,
          u.employee_id,
          r.id AS role_id,
          r.role_name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = ?`,
      [email]
    );

    if (!rows || rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Email atau password salah" });
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Email atau password salah" });
    }

    const accessToken = "dummy-access-token";
    const refreshToken = "dummy-refresh-token";

    return res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        employee_id: user.employee_id,
        role_id: user.role_id,
        role_name: user.role_name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCurrentUser(req, res) {
  try {
    return res.json({
      user: {
        id: 1,
        fullname: "MineWise Demo User",
        email: "demo@minewise.com",
        employee_id: "EMP-001",
        role_id: 1,
        role_name: "Mine Supervisor",
      },
    });
  } catch (err) {
    console.error("getCurrentUser error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
