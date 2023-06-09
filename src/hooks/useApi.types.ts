export interface ApiResponseInterpreter {
  interpretedPlans: [
    {
      planType: string;
      uuid: string;
      description: string;
    }
  ];
}

interface Event {
  allocatedTimeChunks: number;
  calendarId: number;
  category: string;
  color: string;
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

export type ApiResponseEvents = Event[];
