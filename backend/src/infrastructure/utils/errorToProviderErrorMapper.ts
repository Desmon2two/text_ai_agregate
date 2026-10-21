import type { AttemptError } from "../../errors/AttemptErrorType.js";

export default function mapErrorToAttemptError(
	error: Error,
	retryable: boolean,
	provider?: string,
	code?: string,
): AttemptError {
	return {
		message: error.message,
		retryable,
		provider,
		code,
	};
}
