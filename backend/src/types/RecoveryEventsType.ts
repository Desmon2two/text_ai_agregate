export type RecoveryEvent =
	| { name: "RECOVERY_ATTEMPTED" }
	| { name: "PROVIDER_STATUS_CHECKED" }
	| { name: "PROVIDER_COMPLETED" }
	| { name: "PROVIDER_NOT_FOUND" }
	| { name: "RETRY_SCHEDULED" }


    // Work on this too.