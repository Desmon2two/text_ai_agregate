import { ApiError } from "./ApiErrorType";

export type AttemptsStateMachineTypes<T> =
	| { state: "created" }
	| { state: "sending" }
	| { state: "waiting" }
	| { state: "recieved" }
	| { state: "validated" }
	| { state: "complete"; data: T }
	| { state: "failed"; error: ApiError };
