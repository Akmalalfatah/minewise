import apiClient from "./apiClient";

export async function getChatMessage() {
    try {
        const res = await apiClient.get("/ai/chat");
        return res.data || null;
    } catch (err) {
        console.error("Failed to fetch chat message:", err);
        return null;
    }
}

export async function getReasoningData() {
    try {
        const res = await apiClient.get("/ai/reasoning");
        return res.data || null;
    } catch (err) {
        console.error("Failed to fetch reasoning data:", err);
        return null;
    }
}

export async function postUserMessage(messageText) {
    try {
        const payload = {
            human_message: messageText
        };

        const res = await apiClient.post("/ai/chat", payload);
        return res.data || null;
    } catch (err) {
        console.error("Failed to send user message:", err);
        return null;
    }
}
