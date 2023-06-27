import { useEffect, useMemo, useState } from "react";
import { sortEvents } from "../utils/arrays";
import { useEvent } from "./useEvent";
import { useUser } from "./useUser";
import { addDays } from "date-fns";
import { Event } from "../types/event";

const useCalendar = () => {
  const { currentUser: user, isLoading: isLoadingUser } = useUser();

  const [events, setEvents] = useState<Event[]>([]);

  const { fetchEvents } = useEvent();

  const loadEvents = async () => {
    const queryEvents = await fetchEvents({
      start: new Date(),
      end: addDays(new Date(), 7),
    });
    setEvents(queryEvents || []);
  };

  const parsedEvents = useMemo(() => {
    return events
      .map((event) => {
        const endsInFuture = new Date(event.eventEnd).valueOf() > new Date().valueOf();
        const startsInPast = new Date(event.eventStart).valueOf() < new Date().valueOf();

        const isNow = startsInPast && endsInFuture;
        const isPast = new Date(event.eventEnd).valueOf() < new Date().valueOf();
        const isToday = new Date(event.eventStart).getDate() === new Date().getDate();
        const isTomorrow = new Date(event.eventStart).getDate() === new Date().getDate() + 1;

        const parseSection = () => {
          if (isPast) return "PAST";
          if (isNow) return "NOW";
          if (isTomorrow) return "TOMORROW";
          if (isToday) return "TODAY";
          return "OTHER";
        };

        return { ...event, section: parseSection() };
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

  useEffect(() => {
    void loadEvents();
  }, []);

  return {
    loading: isLoadingUser,
    error: !isLoadingUser && !user,
    events,
    eventsNow,
    eventNext,
    eventsToday,
    eventsTomorrow,
    eventsOther,
  };
};

export { useCalendar };
