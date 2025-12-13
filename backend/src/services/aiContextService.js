import axios from "axios";

const ML_BASE_URL = "http://localhost:8000";

export async function getChatReasoningContext(question) {
  const res = await axios.post(`${ML_BASE_URL}/api/chatbox`, {
    human_answer: question
  });
  return res.data;
}

export async function getSimulationContext(params) {
  const res = await axios.get(
    `${ML_BASE_URL}/api/simulation-analysis`,
    { params }
  );
  return res.data;
}
