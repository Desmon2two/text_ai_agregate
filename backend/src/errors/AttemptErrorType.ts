export type AttemptError = {
    message: string;
    retryable: boolean;
    provider?: string;
    code?: string;
}