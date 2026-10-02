import { AiRequest } from "../types/AiRequestType";
import { ValidationError } from "../../errors/validationError";
import OpenAi from "openai";
import { AiResponse } from "../types/AiResponseType";
const client = new OpenAi();

async function openAiProvider(request: AiRequest): Promise<AiResponse> {
	if (!request.model) throw new ValidationError("Model is required");
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
export default{
    openAiProvider,
}