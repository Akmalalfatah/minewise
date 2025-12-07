import { loadJSON } from "../utils/jsonLoader.js";

export function getChatMessage(filters = {}) {
  try {
    const json = loadJSON("chatbox.json");

    if (!json || typeof json !== "object") {
      return {
        messages: [],
        quick_questions: []
      };
    }

    return {
      messages: json.messages || [],
      quick_questions: json.quick_questions || []
    };
  } catch (err) {
    console.error("Failed to load chatbox.json:", err.message);
    return {
      messages: [],
      quick_questions: []
    };
  }
}

export function getReasoningData(filters = {}) {
  try {
    const json = loadJSON("reasoning.json");

    if (!json || typeof json !== "object") {
      return { steps: [], summary: "" };
    }

    return {
      steps: Array.isArray(json.steps) ? json.steps : [],
      summary: json.summary || ""
    };
  } catch (err) {
    console.error("Failed to load reasoning.json:", err.message);
    return { steps: [], summary: "" };
  }
}

export function postUserMessage(humanMessage = "", filters = {}) {
  let quickQuestions = [];

  try {
    const json = loadJSON("chatbox.json");
    quickQuestions = json?.quick_questions || [];
  } catch (err) {
    console.error("Failed to read quick_questions:", err.message);
  }

  return {
    ai_answer: `Dummy AI response to: "${humanMessage}"`,
    ai_time: new Date().toISOString(),
    human_message: humanMessage,
    human_time: new Date().toISOString(),
    quick_questions: quickQuestions
  };
}
