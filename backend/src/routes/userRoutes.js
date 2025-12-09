import express from "express";
import { getMe, updateProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { avatarUpload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, avatarUpload.single("avatar"), updateProfile);

export default router;
