import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_SECRET || "dev-access-token-secret";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Token tidak valid atau expired" });
  }
}
