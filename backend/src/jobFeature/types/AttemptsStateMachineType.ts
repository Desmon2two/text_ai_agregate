import type { AttemptError } from "../../errors/AttemptErrorType";

export type AttemptsStateMachine =
	| { state: "created" }
	| { state: "sending" }
	| { state: "waiting" }
	| { state: "received"; data: unknown }
	| { state: "validated"; data: unknown }
	| { state: "complete"; data: unknown }
	| { state: "failed"; error: AttemptError };
