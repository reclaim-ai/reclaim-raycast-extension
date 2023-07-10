import { Icon, LaunchType, MenuBarExtra, getPreferenceValues, launchCommand, open } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import {
  addDays,
  addMinutes,
  differenceInHours,
  endOfDay,
  format,
  formatDistance,
  isAfter,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import { useMemo } from "react";
import { useEvent } from "./hooks/useEvent";
import { ApiResponseEvents, ApiResponseMoment } from "./hooks/useEvent.types";
import { Event } from "./types/event";
import { NativePreferences } from "./types/preferences";
import { sortEvents } from "./utils/arrays";
import { miniDuration } from "./utils/dates";
import { eventColors, truncateEventSize } from "./utils/events";
import { parseEmojiField } from "./utils/string";

type EventSection = { section: string; sectionTitle: string; events: Event[] };

const GRACE_PERIOD = 5;

const ActionOptionsWithContext = ({ event }: { event: Event }) => {
  const { getEventActions } = useEvent();

  return (
    <>
      {getEventActions(event).map((action) => (
        <MenuBarExtra.Item key={action.title} title={action.title} onAction={action.action} />
      ))}
    </>
  );
};

const EventsSection = ({ events, sectionTitle }: { events: Event[]; sectionTitle: string }) => {
  const { showFormattedEventTitle } = useEvent();

  return (
    <>
      <MenuBarExtra.Section title={sectionTitle} />
      {events.map((event) => (
        <MenuBarExtra.Submenu
          key={event.eventId}
          icon={{
            source: Icon.Dot,
            tintColor: eventColors[event.color],
          }}
          title={showFormattedEventTitle(event, true)}
        >
          <ActionOptionsWithContext event={event} />
        </MenuBarExtra.Submenu>
      ))}
    </>
  );
};

export default function Command() {
  const { apiToken, apiUrl, upcomingEventsCount } = getPreferenceValues<NativePreferences>();

  const NUMBER_OF_EVENTS = Number(upcomingEventsCount) || 5;

  const fetchHeaders = {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const range = {
    start: format(startOfDay(new Date()), "yyyy-MM-dd"),
    end: format(addDays(new Date(), 2), "yyyy-MM-dd"),
  };

  const { data: eventData, isLoading: isLoadingEvents } = useFetch<ApiResponseEvents>(
    `${apiUrl}/events?sourceDetails=true&start=${range.start}&end=${range.end}`,
    {
      headers: fetchHeaders,
      keepPreviousData: true,
    }
  );

  const { data: eventMoment, isLoading: isLoadingMoment } = useFetch<ApiResponseMoment>(`${apiUrl}/moment/next`, {
    headers: fetchHeaders,
    keepPreviousData: true,
  });

  const events = useMemo<EventSection[]>(() => {
    if (!eventData) return [];

    const now = new Date();
    const today = startOfDay(now);

    const events: EventSection[] = [
      {
        section: "NOW",
        sectionTitle: "Now",
        events: eventData
          .filter((event) => {
            return event.reclaimEventType !== "CONF_BUFFER" && event.reclaimEventType !== "TRAVEL_BUFFER";
          })
          .filter((event) => {
            const start = new Date(event.eventStart);
            const end = new Date(event.eventEnd);
            return isWithinInterval(now, { start, end });
          })
          .filter((event) => {
            return !(differenceInHours(new Date(event.eventEnd), new Date(event.eventStart)) >= 24);
          }),
      },
      {
        section: "TODAY",
        sectionTitle: "Upcoming events",
        events: eventData
          .filter((event) => {
            return event.reclaimEventType !== "CONF_BUFFER" && event.reclaimEventType !== "TRAVEL_BUFFER";
          })
          .filter((event) => {
            const start = new Date(event.eventStart);
            return isWithinInterval(start, { start: now, end: endOfDay(today) });
          })
          .filter((event) => {
            return !(differenceInHours(new Date(event.eventEnd), new Date(event.eventStart)) >= 24);
          })
          .slice(0, NUMBER_OF_EVENTS),
      },
    ];

    return events.filter((event) => event.events.length > 0);
  }, [eventData]);

  const handleOpenReclaim = () => {
    open("https://app.reclaim.ai");
  };

  const handleOpenRaycast = async () => {
    await launchCommand({ name: "my-calendar", type: LaunchType.UserInitiated });
  };

  const title = useMemo(() => {
    const eventNow = eventMoment?.event;

    if (eventNow) {
      const realEventTitle = eventNow.sourceDetails?.title || eventNow.title;
      const eventStart = new Date(eventNow.eventStart);
      const eventEnd = new Date(eventNow.eventEnd);

      const nowOrNext = isWithinInterval(new Date(), { start: eventStart, end: eventEnd });
      return `${nowOrNext}: ${truncateEventSize(parseEmojiField(realEventTitle).textWithoutEmoji)}`;
    }

    return "No upcoming events";
  }, [eventMoment]);

  return (
    <MenuBarExtra isLoading={isLoadingEvents || isLoadingMoment} icon={"command-icon.png"} title={title} tooltip="test">
      {events.map((eventSection) => (
        <EventsSection
          key={eventSection.section}
          events={eventSection.events}
          sectionTitle={eventSection.sectionTitle}
        />
      ))}
      <MenuBarExtra.Separator />
      <MenuBarExtra.Item title="Open Reclaim" onAction={handleOpenReclaim} />
      <MenuBarExtra.Item title="Open Raycast" onAction={handleOpenRaycast} />
    </MenuBarExtra>
  );
}
