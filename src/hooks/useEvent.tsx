import { Cache } from "@raycast/api";
import { addDays, endOfDay, format } from "date-fns";
import { useCallback, useState } from "react";
import { Event, ReclaimEventType } from "../types/event";
import { axiosPromiseData } from "../utils/axiosPromise";
import { formatDisplayEventHours, formatDisplayHours } from "../utils/dates";
import { parseEmojiField } from "../utils/string";
import reclaimApi from "./useApi";
import { ApiResponseEvents } from "./useEvent.types";
import { useUser } from "./useUser";

const cache = new Cache();

const useEvent = () => {
  const { fetcher } = reclaimApi();
  const { currentUser } = useUser();

  const cached = cache.get("events");

  const [events, setEvents] = useState<Event[]>(cached ? JSON.parse(cached) : []);

  const fetchEvents = async () => {
    try {
      const start = format(new Date(), "yyyy-MM-dd");
      const end = format(endOfDay(addDays(new Date(), 2)), "yyyy-MM-dd");

      const [fetchEvents, error] = await axiosPromiseData<ApiResponseEvents>(
        fetcher("/events", {
          method: "GET",
          params: { start, end },
        })
      );

      if (!fetchEvents || error) throw error;
      setEvents(fetchEvents);
      cache.set("events", JSON.stringify(fetchEvents));
    } catch (error) {
      console.error(error);
    }
  };

  const showFormattedEventTitle = useCallback(
    (event: Event, mini = false) => {
      const meridianFormat = currentUser?.settings.format24HourTime ? "24h" : "12h";

      const hours = mini
        ? formatDisplayHours(new Date(event.eventStart), meridianFormat)
        : formatDisplayEventHours({
            start: new Date(event.eventStart),
            end: new Date(event.eventEnd),
            hoursFormat: meridianFormat,
          });
      return `${hours}  ${parseEmojiField(event.title).textWithoutEmoji}`;
    },
    [currentUser]
  );

  const getEventActions = useCallback((event: Event) => {
    switch (event.assist.eventType as ReclaimEventType) {
      case "TASK_ASSIGNMENT":
        return [
          {
            title: "Complete",
            action: () => {
              //
            },
          },
          {
            title: "Snooze",
            action: () => {
              //
            },
          },
          {
            title: "Delete",
            action: () => {
              //
            },
          },
        ];
      case "ONE_ON_ONE_ASSIGNMENT":
        return [
          {
            title: "Join Meeting",
            action: () => {
              //
            },
          },
        ];
      case "HABIT_ASSIGNMENT":
        return [
          {
            title: "start",
            action: () => {
              //
            },
          },
        ];
      default:
        return [];
    }
  }, []);

  return {
    fetchEvents,
    events,
    getEventActions,
    showFormattedEventTitle,
  };
};

export { useEvent };
