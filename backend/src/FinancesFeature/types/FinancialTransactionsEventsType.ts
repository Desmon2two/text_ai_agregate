export type FinancialTransactionsEvents =
	| { name: "RESERVED" }
	| { name: "PURCHASE" }
	| { name: "REFUND" }
	| { name: "ADMIN_ADJUSTMENT" }
	| { name: "JOB_COMPLETE" };

// the retry policy shall be recorded separately
