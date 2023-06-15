export enum ReclaimEventTypeEnum {
  USER = "USER",
  SYNC = "SYNC",
  HABITASSIGNMENT = "HABIT_ASSIGNMENT",
  ONEONONEASSIGNMENT = "ONE_ON_ONE_ASSIGNMENT",
  TASKASSIGNMENT = "TASK_ASSIGNMENT",
  CONFBUFFER = "CONF_BUFFER",
  TRAVELBUFFER = "TRAVEL_BUFFER",
  SCHEDULINGLINKMEETING = "SCHEDULING_LINK_MEETING",
  UNKNOWN = "UNKNOWN",
}

export type ReclaimEventType = `${ReclaimEventTypeEnum}`;

export interface Event {
  allocatedTimeChunks: number;
  assist: {
    assistReferenceValid: boolean;
    conferenceBuffer: boolean;
    customHabit: boolean;
    dailyHabitId: number;
    defended: boolean;
    eventType?: ReclaimEventTypeEnum;
    habitOrTask: boolean;
    lastControlledHash: number;
    pinned: boolean;
    recurringAssignmentType: string;
    status: string;
    task: boolean;
    type: string;
  };
  calendarId: number;
  category: string;
  color:
    | "NONE"
    | "LAVENDER"
    | "SAGE"
    | "GRAPE"
    | "FLAMINGO"
    | "BANANA"
    | "TANGERINE"
    | "PEACOCK"
    | "GRAPHITE"
    | "BLUEBERRY"
    | "BASIL"
    | "TOMATO";
  conferenceCall: boolean;
  etag: string;
  eventEnd: string;
  eventId: string;
  eventStart: string;
  free: boolean;
  key: string;
  numAttendees: number;
  onlineMeetingUrl: string;
  organizer: string;
  personalSync: boolean;
  private: boolean;
  public: boolean;
  published: boolean;
  reclaimEventType: string;
  reclaimManaged: boolean;
  recurring: boolean;
  recurringException: boolean;
  recurringInstance: boolean;
  requiresTravel: boolean;
  rsvpStatus: string;
  scoredType: string;
  status: string;
  subType: string;
  timeChunks: number;
  title: string;
  titleSeenByOthers: string;
  type: string;
  underAssistControl: boolean;
  updated: string;
  version: string;
}
