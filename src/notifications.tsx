import { Icon, MenuBarExtra, getPreferenceValues } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { addDays, addMinutes, endOfDay, format, formatDistance, isAfter, isWithinInterval, startOfDay } from "date-fns";
import { useMemo } from "react";
import { useEvent } from "./hooks/useEvent";
import { ApiResponseEvents } from "./hooks/useEvent.types";
import { Event } from "./types/event";
import { NativePreferences } from "./types/preferences";
import { sortEvents } from "./utils/arrays";
import { eventColors } from "./utils/events";
import { parseEmojiField } from "./utils/string";

type EventSection = { section: string; sectionTitle: string; events: Event[] };

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
  const { apiToken, apiUrl } = getPreferenceValues<NativePreferences>();

  const fetchHeaders = {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const range = {
    start: format(startOfDay(new Date()), "yyyy-MM-dd"),
    end: format(addDays(new Date(), 2), "yyyy-MM-dd"),
  };

  const { data, isLoading } = useFetch<ApiResponseEvents>(
    `${apiUrl}/events?sourceDetails=true&start=${range.start}&end=${range.end}`,
    {
      headers: fetchHeaders,
      keepPreviousData: true,
    }
  );

  const events = useMemo<EventSection[]>(() => {
    if (!data) return [];

    const now = new Date();
    const today = startOfDay(now);
    const tomorrow = startOfDay(addDays(now, 1));

    const events: EventSection[] = [
      {
        section: "NOW",
        sectionTitle: "Now",
        events: data.filter((event) => {
          const start = new Date(event.eventStart);
          const end = new Date(event.eventEnd);
          return isWithinInterval(now, { start, end });
        }),
      },
      {
        section: "TODAY",
        sectionTitle: "Today",
        events: data.filter((event) => {
          const start = new Date(event.eventStart);
          // const end = new Date(event.eventEnd);
          return isWithinInterval(start, { start: today, end: endOfDay(today) });
        }),
      },
      {
        section: "TOMORROW",
        sectionTitle: "Tomorrow",
        events: data.filter((event) => {
          const start = new Date(event.eventStart);
          // const end = new Date(event.eventEnd);
          return isWithinInterval(start, { start: tomorrow, end: endOfDay(tomorrow) });
        }),
      },
    ];

    return events.filter((event) => event.events.length > 0);
  }, [data]);

  const title = useMemo(() => {
    const notEndedEvents = data
      ?.filter((event) => {
        const end = new Date(event.eventEnd);
        return isAfter(end, new Date());
      })
      .sort(sortEvents);

    if (!notEndedEvents?.length) return "No events today";

    const hasEventsNow = notEndedEvents.some((event) => {
      const start = new Date(event.eventStart);
      const end = addMinutes(new Date(event.eventStart), 3);
      return isWithinInterval(new Date(), { start, end });
    });

    if (hasEventsNow) {
      const evNow = notEndedEvents[0];
      return `Now: ${parseEmojiField(evNow.title).textWithoutEmoji}`;
    }

    const nextEvents = notEndedEvents
      .filter((event) => {
        const start = new Date(event.eventStart);
        return isAfter(start, new Date());
      })
      .sort(sortEvents);

    return `Next: ${parseEmojiField(nextEvents[0].title).textWithoutEmoji} in ${formatDistance(
      new Date(),
      new Date(nextEvents[0].eventStart)
    )}`;
  }, [data]);

  return (
    <MenuBarExtra isLoading={isLoading} icon={"command-icon.png"} title={title}>
      {events.map((eventSection) => (
        <EventsSection
          key={eventSection.section}
          events={eventSection.events}
          sectionTitle={eventSection.sectionTitle}
        />
      ))}
    </MenuBarExtra>
  );
}
