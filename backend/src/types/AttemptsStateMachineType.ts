import { ApiError } from "./ApiErrorType";

export type AttemptsStateMachineTypes<T> =
	| { state: "created" }
	| { state: "sending" }
	| { state: "waiting" }
	| { state: "received"; data: T }
	| { state: "validated"; data: T }
	| { state: "complete"; data: T }
	| { state: "failed"; error: ApiError };
