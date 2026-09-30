export type AiRequest = {
	provider: string;
	model: string;
	prompt: string;
	files?: string[];
};
