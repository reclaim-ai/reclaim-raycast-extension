import { Event } from "../types/event";

export type ApiResponseEvents = Event[];

type EventAction = { title: string; action: () => Promise<unknown | void> | unknown };
export type EventActions = EventAction[];
