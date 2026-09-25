export type EventStateMachineTypes =
	| { name: "JOB_ACCEPTED" }
	| { name: "WORKER_STARTED" }
	| { name: "ATTEMPT_CREATED" }
	| { name: "SENDING_REQUEST" }
	| { name: "WAITING_FOR_RESPONSE" }
	| { name: "RESPONSE_GET" }
	| { name: "RESPONSE_VALIDATED" }
	| { name: "COMPLETE" }
	| { name: "FAILED"; failureCode: string; retryable: boolean };

// Work on errors flow
