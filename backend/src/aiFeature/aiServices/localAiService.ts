import mapErrorToAttemptError from "../../infrastructure/utils/errorToProviderErrorMapper";

const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";
const MODEL = "gemma3:1b";

async function acceptJob(prompt: string): Promise<{
  received_data: string;
  input_tokens: number;
  output_tokens: number;
}> {
  try {
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
    const data = await response.json();
    return {
      received_data: data.message.content,
      input_tokens: data.prompt_eval_count,
      output_tokens: data.eval_count,
    };
  } catch (error) {
    const attemptError = mapErrorToAttemptError(
      error,
      false,
      "local",
      "gemma3:1b",
    );
    throw attemptError;
  }
}

export default { acceptJob };
