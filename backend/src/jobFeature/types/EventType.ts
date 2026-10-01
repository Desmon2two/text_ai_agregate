import { EventStateMachineTypes } from "./EventsStateMachineType";

export type EventType = {
	state: EventStateMachineTypes;
	createdAt: Date;
};
