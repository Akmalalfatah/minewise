import apiClient from "./apiClient";

export async function postUserMessage(messageText) {
    try {
        const response = await apiClient.post("/ai/chat", {
            human_message: messageText
        });

        return response.data;
    } catch (error) {
        console.error("AI chat request failed:", error);
        throw error;
    }
}
