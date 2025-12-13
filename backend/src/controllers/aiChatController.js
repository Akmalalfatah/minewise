import { detectIntent } from "../services/intentDetector.js";
import { fetchMLDataByIntent } from "../services/mlService.js";
import { buildChatPrompt } from "../services/promptBuilder.js";
import { askGemini } from "../services/geminiService.js";

export async function postChat(req, res) {
  const { human_message } = req.body;

  try {
    const intent = detectIntent(human_message);

    const mlResponse = await fetchMLDataByIntent(intent);
    const mlData = mlResponse.data;

    const prompt = buildChatPrompt(human_message, mlData);
    const aiAnswer = await askGemini(prompt);

    res.json({
      human_answer: human_message,
      detected_intent: intent,
      ai_answer: aiAnswer,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    res.status(500).json({
      human_answer: human_message,
      ai_answer: "SYSTEM ERROR: " + error.message
    });
  }
}
