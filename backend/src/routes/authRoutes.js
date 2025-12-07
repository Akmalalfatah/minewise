import { Router } from "express";
import {
  login,
  getCurrentUser,
  refreshToken,
} from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.get("/me", getCurrentUser);
router.post("/refresh", refreshToken);

export default router;
