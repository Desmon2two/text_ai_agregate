export type PlanJobInput = {
	body: unknown;
	files: string[];
};
export type PlanJobOutput = {
	planId: string;
	provider: string;
	model: string;
	advantages: string[];
	estimatedCost: number;
	interpretedIntent: string;
};
export type CommitJobInput = {
	planId: string;
};

export type CommitJobOutput = {
	jobId: string;
	createdAt: Date;
};
