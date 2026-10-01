import { AttemptError } from "../../errors/AttemptErrorType";

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
