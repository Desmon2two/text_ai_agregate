import { EventStateTypes } from "./EventsStateType";

export type EventType = {
	state: EventStateTypes;
	attemptId: string;
	createdAt?: Date;
};
