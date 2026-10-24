import type { EventNamesType } from "./EventsStateType.js";

/* 
The db tables are a source of truth for jobs, attempts, and events
*/
export type EventType = {
  event_id: string;
  name: EventNamesType;
  attempt_id?: string;
  job_id?: string;
  metadata?: unknown;
  created_at?: Date;
};
