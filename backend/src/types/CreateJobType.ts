export type CreateJobInput = {
	userId: string;
	jobTypeId: number;
	body: unknown;
	files: string[];
};

export type CreateJobResult = {
	jobId: string;
	createdAt: Date;
};
