import express from "express";
import { postChat } from "../controllers/aiChatController.js";

const router = express.Router();

router.post("/chat", postChat);

export default router;
