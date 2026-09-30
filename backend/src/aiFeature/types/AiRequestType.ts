export type AiRequest = {
    provider: string;
    model: string;
    body: unknown;
    files?: string[];
}