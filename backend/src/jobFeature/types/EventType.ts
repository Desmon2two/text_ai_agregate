import { EventStateMachineTypes } from "./EventsStateMachineType";

export type EventType = {
	state: EventStateMachineTypes;
	attemptId: string;
	createdAt?: Date;
};
