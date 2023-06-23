import { Icon } from "@raycast/api";
import { Event } from "../types/event";

export type ApiResponseEvents = Event[];

type EventAction = { title: string; action: () => Promise<unknown | void> | unknown; icon: Icon };

export type EventActions = EventAction[];

// export type EventActionsKeys = ""
