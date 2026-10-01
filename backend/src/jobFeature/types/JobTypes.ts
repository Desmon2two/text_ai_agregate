export type PlanJobInput = {
	body: unknown;
	files: string[];
};
export type PlanJobOutput = {
	provider: string;
	model: string;
	advantages: string[];
	estimatedCost: number;
	interpretedIntent: string;
};
export type CommitJobInput = {
	body: {
		prompt: string;
		[key: string]: unknown;
	};
	files: string[];
	provider: string;
	model: string;
	jobType: string;
};

export type CommitJobOutput = {
	jobId: string;
	createdAt: Date;
};

export type completeJobType = {
	jobId: string;
	attemptId: string;
	data: unknown;
};
