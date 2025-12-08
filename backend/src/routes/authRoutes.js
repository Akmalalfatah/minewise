import { Router } from "express";
import { login, getCurrentUser, refreshToken } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.post("/refresh", refreshToken);
router.get("/me", authMiddleware, getCurrentUser);

export default router;
