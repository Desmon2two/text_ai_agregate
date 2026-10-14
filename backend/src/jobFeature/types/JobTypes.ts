import { Client } from "pg";
import type { JobStateTypes } from "./JobStateType";


/* 
The db tables are a source of truth for jobs, attempts, and events
*/
type Job = {
	userId: string;
	jobId: string;
	state: JobStateTypes;
	type: string;
	body: unknown;
	files?: string[];
	error?: unknown;
	data?: unknown;
	metadata?: unknown;
	recoveryWorkerId: string;
	recoveryLeaseUntil: Date;
	estimatedCost: number;
	actualCost?: number;
	createdAt: Date;
}
type CreateJob = {
	dbClient: Client;
	userId: string;
	type: string;
	body: unknown;
	estimatedCost: number;
};
type CommitJobInput = {
	dbClient: Client;
	body: {
		prompt: string;
		[key: string]: unknown;
	};
	files?: string[];
	provider: string;
	model: string;
	type: string;
};

type CommitJobOutput = {
	jobId: string;
	createdAt: Date;
};

type completeJobType = {
	dbClient: Client;
	jobId: string;
	attemptId: string;
};
export {
	Job,
	CreateJob,
	CommitJobInput,
	CommitJobOutput,
	completeJobType
}
