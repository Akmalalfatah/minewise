import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function authMiddleware(req, res, next) {
const authHeader = req.headers.authorization || "";
const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

if (!token) {
return res.status(401).json({ message: "Token tidak ditemukan" });
}

try {
const decoded = jwt.verify(token, JWT_SECRET);
req.user = decoded;
next();
} catch (err) {
return res.status(401).json({ message: "Token tidak valid atau expired" });
}
}
