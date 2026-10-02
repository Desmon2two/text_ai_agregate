export type JobStateMachineTypes =
	| { state: "created" }
	| { state: "accepted" }
	| { state: "queued" }
	| { state: "processing" }
	| { state: "complete"; data: unknown }
	| { state: "failed"; error: Error };

// the retry policy shall be recorded separately
