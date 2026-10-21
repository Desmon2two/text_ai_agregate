import { EventNamesType } from "./EventsStateType.js";

/* 
The db tables are a source of truth for jobs, attempts, and events
*/
export type EventType = {
  eventId: string;
  name: EventNamesType;
  attemptId?: string;
  jobId?: string;
  metadata?: unknown;
  createdAt?: Date;
};
