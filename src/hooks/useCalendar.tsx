import { useCallback, useEffect, useMemo, useState } from "react";
import { Event } from "../types/event";
import { sortEvents } from "../utils/arrays";
import { formatDisplayEventHours } from "../utils/dates";
import { parseEmojiField } from "../utils/string";
import { useEvent } from "./useEvent";
import { useUser } from "./useUser";

const useCalendar = () => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  const { currentUser: user, isLoading: isLoadingUser } = useUser();
  const { getEvents } = useEvent();

  // const filteredEvents = events.filter((event) => event.title.toLowerCase().includes(searchText.toLowerCase()));

  const showFormattedEventTitle = useCallback((event: Event) => {
    return `${formatDisplayEventHours({
      start: new Date(event.eventStart),
      end: new Date(event.eventEnd),
      hoursFormat: user?.settings.format24HourTime ? "24h" : "12h",
    })}  ${parseEmojiField(event.title).textWithoutEmoji}`;
  }, []);

  const parsedEvents = useMemo(() => {
    return events
      .filter((event) => {
        const isPast = new Date(event.eventEnd).valueOf() < new Date().valueOf();
        return !isPast;
      })
      .map((event) => {
        const endsInFuture = new Date(event.eventEnd).valueOf() > new Date().valueOf();
        const startsInPast = new Date(event.eventStart).valueOf() < new Date().valueOf();

        const isNow = startsInPast && endsInFuture;
        const isToday = new Date(event.eventStart).getDate() === new Date().getDate();
        const isTomorrow = new Date(event.eventStart).getDate() === new Date().getDate() + 1;

        return { ...event, section: isNow ? "NOW" : isTomorrow ? "TOMORROW" : isToday ? "TODAY" : "OTHER" };
      })
      .sort(sortEvents);
  }, [events]);

  const eventsNow = useMemo(() => parsedEvents.filter((event) => event.section === "NOW"), [parsedEvents]);

  const [eventNext, ...eventsToday] = useMemo(
    () => parsedEvents.filter((event) => event.section === "TODAY"),
    [parsedEvents]
  );

  const eventsTomorrow = useMemo(() => parsedEvents.filter((event) => event.section === "TOMORROW"), [parsedEvents]);

  const eventsOther = useMemo(() => parsedEvents.filter((event) => event.section === "OTHER"), [parsedEvents]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const events = await getEvents();
    setEvents(events || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchEvents();
  }, []);

  return {
    loading: loading || isLoadingUser,
    error: !loading && !isLoadingUser && !user,
    events,
    eventsNow,
    eventNext,
    eventsToday,
    eventsTomorrow,
    eventsOther,
    showFormattedEventTitle,
  };
};

export { useCalendar };
