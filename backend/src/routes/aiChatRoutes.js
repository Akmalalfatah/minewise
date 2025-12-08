import express from "express";
import {
  getChat,
  postChat,
  getReasoningData
} from "../controllers/aiChatController.js";

const router = express.Router();

router.get("/chat", getChat);
router.post("/chat", postChat);
router.get("/reasoning", getReasoningData);

export default router;
