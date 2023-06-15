import { useEffect, useMemo } from "react";
import { sortEvents } from "../utils/arrays";
import { useEvent } from "./useEvent";
import { useUser } from "./useUser";

const useCalendar = () => {
  const { currentUser: user, isLoading: isLoadingUser } = useUser();
  const { fetchEvents, events } = useEvent();

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

  useEffect(() => {
    void fetchEvents();
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
