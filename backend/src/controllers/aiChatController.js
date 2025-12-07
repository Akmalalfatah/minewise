import {
  getInitialChat,
  getReasoning,
  processUserMessage
} from "../services/aiChatService.js";

export async function getChat(req, res) {
  const result = await getInitialChat();
  return res.json(result);
}

export async function getReasoningData(req, res) {
  const result = await getReasoning();
  return res.json(result);
}

export async function postChat(req, res) {
  const { human_message } = req.body || {};
  const result = await processUserMessage(human_message);
  return res.json(result);
}
