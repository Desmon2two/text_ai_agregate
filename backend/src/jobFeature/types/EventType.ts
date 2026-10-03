import { EventNamesType } from "./EventsStateType";

export type EventType = {
	name: EventNamesType;
	attemptId?: string;
	jobId?: string;
	metadata?: unknown;
	createdAt?: Date;
};
