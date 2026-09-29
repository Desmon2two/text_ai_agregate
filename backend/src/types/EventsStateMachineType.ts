export type EventStateMachineTypes =
	| { name: "JOB_ACCEPTED" }
	| { name: "WORKER_STARTED" }
	| { name: "ATTEMPT_CREATED" }
	| { name: "SENDING_REQUEST"; metadata: { model: string } }
	| { name: "WAITING_FOR_RESPONSE"; metadata: { heartbeat: Date } }
	| { name: "RESPONSE_GET" }
	| { name: "RESPONSE_VALIDATED" }
	| { name: "COMPLETE" }
	| { name: "RECOVERY_STARTED"; metadata: { reason: string } }
	| { name: "RECOVERY_ABANDONED"; metadata: { reason: string } }
	| { name: "RECOVERY_COMPLETE"; metadata: { log: string } }
	| {
			name: "FAILED";
			metadata: { failureStatus: string; failureMessage: string };
	  };

// Work on errors flow
