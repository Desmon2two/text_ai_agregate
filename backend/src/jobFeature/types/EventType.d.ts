import { EventNamesType } from "./EventsStateType";
export type EventType = {
    eventId: string;
    name: EventNamesType;
    attemptId?: string;
    jobId?: string;
    metadata?: unknown;
    createdAt?: Date;
};
//# sourceMappingURL=EventType.d.ts.map