import express from "express";
import {
    getChatMessage,
    getReasoningData,
    postUserMessage,
} from "../controllers/aiChatController.js";

const router = express.Router();

router.get("/chat", getChatMessage);
router.get("/reasoning", getReasoningData);
router.post("/chat", postUserMessage);

export default router;