const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";
const MODEL = "gemma3:1b";
async function acceptJob(prompt) {
    const response = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant. Be concise.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            stream: false,
        }),
    });
    if (!response.ok) {
        throw new Error(`Ollama returned HTTP ${response.status}: ${await response.text()}`);
    }
    const data = await response.json();
    return data.message.content;
}
export default { acceptJob };
