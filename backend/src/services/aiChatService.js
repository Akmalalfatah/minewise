const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-flash-latest";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/" +
  modelName +
  ":generateContent?key=" +
  apiKey;

const DEFAULT_QUESTIONS = [
  "Optimal truck allocation?",
  "Which road has highest risk today?",
  "How does rain impact production?",
  "Should we adjust production targets today?"
];

const SYSTEM_MESSAGE =
  "You are MineWise AI Assistant, an expert in coal mining operations, production planning, logistics, and risk assessment in coal mining. Answer concisely and clearly.";

export async function getInitialChat() {
  const now = new Date().toISOString();

  return {
    ai_answer:
      "Hello, I am MineWise AI Assistant. Ask me about production, road risk, weather impact, or vessel loading schedules.",
    ai_time: now,
    quick_questions: DEFAULT_QUESTIONS
  };
}

// GET /api/ai/reasoning
export async function getReasoning() {
  return {
    reasoning_steps: [
      "AI menganalisis konteks permintaan.",
      "AI mengecek data cuaca dan kondisi jalan.",
      "AI membandingkan pola historis.",
      "AI menyusun rekomendasi terbaik."
    ],
    data_sources: {
      weather: "Connected",
      equipment: "Connected",
      road: "Connected",
      vessel: "Connected"
    }
  };
}

export async function processUserMessage(humanMessage = "") {
  const human_time = new Date().toISOString();

  if (!humanMessage || humanMessage.trim() === "") {
    return {
      human_answer: "",
      human_time,
      ai_answer: "Please enter a valid question.",
      ai_time: new Date().toISOString(),
      quick_questions: DEFAULT_QUESTIONS
    };
  }

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing in .env");
    return {
      human_answer: humanMessage,
      human_time,
      ai_answer:
        "AI engine is not configured (missing API key). Please contact the system admin.",
      ai_time: new Date().toISOString(),
      quick_questions: DEFAULT_QUESTIONS
    };
  }

  try {
    const prompt = `${SYSTEM_MESSAGE}\n\nUser: ${humanMessage}`;

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      console.error("Gemini HTTP error:", response.status, errJson);
      throw new Error("Gemini HTTP error " + response.status);
    }

    const data = await response.json();

    const aiText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I could not generate a response.";

    return {
      human_answer: humanMessage,
      human_time,
      ai_answer: aiText.trim(),
      ai_time: new Date().toISOString(),
      quick_questions: DEFAULT_QUESTIONS
    };
  } catch (err) {
    console.error("Gemini error:", err);

    return {
      human_answer: humanMessage,
      human_time,
      ai_answer:
        "I couldn't connect to the AI engine. Rain can reduce hauling efficiency, increase road slipperiness, and slow overall production.",
      ai_time: new Date().toISOString(),
      quick_questions: DEFAULT_QUESTIONS
    };
  }
}
