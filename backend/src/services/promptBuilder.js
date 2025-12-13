export function buildChatPrompt(question, mlData) {
    return `
Kamu adalah AI Mining Operations Assistant.

DATA ANALISIS (JSON):
${JSON.stringify(mlData, null, 2)}

Jawab pertanyaan berikut berdasarkan data di atas.

Pertanyaan:
"${question}"

Jawaban:
`;
}
