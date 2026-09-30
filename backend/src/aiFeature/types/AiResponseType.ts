export type AiResponse = {
	data: unknown;
	usage?: {
		inputTokens?: number;
		outputTokens?: number;
	};
	providerOperationId?: string | null;
};
