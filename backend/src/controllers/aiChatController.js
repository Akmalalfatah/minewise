import * as service from "../services/aiChatService.js";
import { parseFilters } from "../utils/filterUtil.js";

export async function getChatMessage(req, res) {
    const payload = await service.getChatMessage(parseFilters(req.query));
    return res.json(payload);
}

export async function getReasoningData(req, res) {
    const payload = await service.getReasoningData(parseFilters(req.query));
    return res.json(payload);
}

export async function postUserMessage(req, res) {
    const { human_message } = req.body || {};
    const payload = await service.postUserMessage(human_message, parseFilters(req.query));
    return res.json(payload);
}
