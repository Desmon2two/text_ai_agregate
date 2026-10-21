import { AiRequest } from "../types/AiRequestType.js";
import { ValidationError } from "../../errors/validationError.js";
import OpenAi from "openai";
import { AiResponse } from "../types/AiResponseType.js";
const client = new OpenAi();
async function openAiProvider(request) {
    if (!request.model)
        throw new ValidationError("Model is required");
    const response = await client.responses.create({
        model: request.model,
        input: request.prompt,
    });
    return {
        data: response.output_text,
        usage: {
            inputTokens: response.usage?.input_tokens,
            outputTokens: response.usage?.output_tokens,
        },
        providerOperationId: response.id,
    };
}
export default {
    openAiProvider,
};
