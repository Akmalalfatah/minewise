import { loadJSON } from "../utils/jsonLoader.js";

export function getChatMessage(filters = {}) {
  const json = loadJSON("chatbox.json");
  return json || {};
}

export function getReasoningData(filters = {}) {
  const json = loadJSON("reasoning.json");
  return json || {};
}

export function postUserMessage(humanMessage = "", filters = {}) {
  return {
    ai_answer: `Dummy AI response to: "${humanMessage}"`,
    ai_time: new Date().toISOString(),
    human_message: humanMessage,
    human_time: new Date().toISOString(),
    quick_questions: (loadJSON("chatbox.json")?.quick_questions) || []
  };
}
