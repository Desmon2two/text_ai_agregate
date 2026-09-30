export type AiProviderError = {
	provider: string;
	message: string;
	retryable: boolean;
	code?: string;
};
