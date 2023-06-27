import { useEffect, useMemo, useState } from "react";
import { sortEvents } from "../utils/arrays";
import { useEvent } from "./useEvent";
import { useUser } from "./useUser";
import { addDays, addMinutes } from "date-fns";
import { Cache } from "@raycast/api";
import { Event } from "../types/event";

const cache = new Cache();

type ShortCalendarEvent = Event & { section: "NOW" | "TOMORROW" | "TODAY" | "OTHER" };

const useShortCalendar = () => {
  console.log("### =>", "src/hooks/useShortCalendar.tsx");

  const { currentUser: user, isLoading: isLoadingUser } = useUser();
  const [events, setEvents] = useState<Event[]>([]);

  const { fetchEvents } = useEvent();

  const rawCachedSmallCalendar = cache.get("smallCalendar");
  const cachedSmallCalendar = rawCachedSmallCalendar ? JSON.parse(rawCachedSmallCalendar) : null;
  const needCacheUpdate =
    !cachedSmallCalendar ||
    (cachedSmallCalendar && new Date(cachedSmallCalendar.invalidationDate).valueOf() < new Date().valueOf());

  const setCachedEvents = (parsedEvents: ShortCalendarEvent[]) => {
    cache.set("smallCalendar", JSON.stringify({ events: parsedEvents, invalidationDate: addMinutes(new Date(), 1) }));
  };

  const parsedEvents = useMemo<ShortCalendarEvent[]>(() => {
    // console.log("### =>", { needCacheUpdate, cachedSmallCalendar });

    if (!needCacheUpdate && cachedSmallCalendar.events.length > 0) {
      return cachedSmallCalendar.events as ShortCalendarEvent[];
    }

    const parsed = events
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
      .sort(sortEvents) as ShortCalendarEvent[];

    setCachedEvents(parsed);

    return parsed;
  }, [events]);

  const loadEvents = async () => {
    const queryEvents = await fetchEvents({
      start: new Date(),
      end: addDays(new Date(), 2),
    });
    setEvents(queryEvents || []);
  };

  useEffect(() => {
    if (needCacheUpdate) void loadEvents();
  }, []);

  return {
    loading: isLoadingUser,
    error: !isLoadingUser && !user,
    parsedEvents,
  };
};

export { useShortCalendar };
