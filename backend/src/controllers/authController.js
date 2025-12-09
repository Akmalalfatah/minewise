import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db/index.js";

const ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_SECRET || "dev-access-token-secret";
const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET || "dev-refresh-token-secret";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

function createAccessToken(user) {
  const payload = {
    sub: user.id,
    fullname: user.fullname,
    email: user.email,
    employee_id: user.employee_id,
    role_id: user.role_id,
    role_name: user.role_name,
  };

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

function createRefreshToken(user) {
  const payload = {
    sub: user.id,
  };

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

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
          u.avatar_url,
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

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    return res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        employee_id: user.employee_id,
        avatar_url: user.avatar_url,
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
    return res
      .status(400)
      .json({ message: "refresh_token wajib dikirim di body" });
  }

  try {
    const decoded = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET);
    const userId = decoded.sub;

    const [rows] = await db.query(
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
       WHERE u.id = ?`,
      [userId]
    );

    if (!rows || rows.length === 0) {
      return res
        .status(401)
        .json({ message: "User tidak ditemukan untuk refresh token ini" });
    }

    const user = rows[0];
    const newAccessToken = createAccessToken(user);

    return res.json({
      access_token: newAccessToken,
    });
  } catch (err) {
    return res.status(401).json({ message: "Refresh token tidak valid" });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const userId = req.user.sub;

    const [rows] = await db.query(
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
       WHERE u.id = ?
       LIMIT 1`,
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
        avatar_url: user.avatar_url,
        role_id: user.role_id,
        role_name: user.role_name,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
