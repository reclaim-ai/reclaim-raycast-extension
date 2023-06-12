import { Timezone } from "./datetime";

export interface User {
  id: string;
  email: string;
  principal: string;
  provider: string;
  name: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  admin: boolean;
  timestampOffsetMs: number;
  settings: UserSettings;
  created: string;
  onboarded: boolean;
  trackingCode: string;
  locale: string;
  likelyPersonal: boolean;
  hostedDomain: string;
  primaryCalendar: UserPrimaryCalendar;
  edition: string;
  editionAfterTrial: string;
  editionUsage: string;
  metadata: UserMetadata;
  timezone: Timezone;
  overage: boolean;
  slackEnabled: boolean;
  startOfWeek: string;
  primaryCalendarId: string;
  sku: string;
}

export interface UserSettings {
  autoAddHangouts: boolean;
  defaultEventLength: number;
  weekStart: number;
  format24HourTime: boolean;
  locale: string;
  showDeclinedEvents: boolean;
  timezone: string;
  dateFieldOrder: string;
}

export interface UserPrimaryCalendar {
  id: number;
  timezone: Timezone;
  calendarId: string;
  lastSynced: string;
  credentialId: number;
}

export interface UserMetadata {
  usecase: string;
  role: string;
  department: string;
}
