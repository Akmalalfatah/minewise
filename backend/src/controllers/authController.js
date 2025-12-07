import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "dev-refresh-secret";

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
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
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: "7d" });

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
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const userId = req.user.userId;

    const [rows] = await db.query(
      `SELECT 
          u.id,
          u.fullname,
          u.email,
          u.employee_id,
          r.id AS role_id,
          r.role_name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [userId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const user = rows[0];

    return res.json({
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
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function refreshToken(req, res) {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ message: "Refresh token wajib dikirim" });
  }

  try {
    const decoded = jwt.verify(refresh_token, REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ access_token: newAccessToken });
  } catch (err) {
    return res.status(401).json({ message: "Refresh token invalid" });
  }
}
