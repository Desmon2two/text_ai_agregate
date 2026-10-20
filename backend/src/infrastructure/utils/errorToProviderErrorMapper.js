import { AttemptError } from "../../errors/AttemptErrorType";
export default function mapErrorToAttemptError(error, retryable, provider, code) {
    return {
        message: error.message,
        retryable,
        provider,
        code,
    };
}
