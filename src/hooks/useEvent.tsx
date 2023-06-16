import { Cache, open } from "@raycast/api";
import { addDays, endOfDay, format, isWithinInterval } from "date-fns";
import { useCallback, useState } from "react";
import { Event } from "../types/event";
import { axiosPromiseData } from "../utils/axiosPromise";
import { formatDisplayEventHours, formatDisplayHours } from "../utils/dates";
import { parseEmojiField } from "../utils/string";
import reclaimApi from "./useApi";
import { ApiResponseEvents, EventActions } from "./useEvent.types";
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

  const handleStartTask = async (id: string) => {
    try {
      const [task, error] = await axiosPromiseData(fetcher(`/planner/start/task/${id}`, { method: "POST" }));
      if (!task || error) throw error;
      return task;
    } catch (error) {
      console.error(error);
    }
  };

  const handleStopTask = async (id: string) => {
    try {
      const [task, error] = await axiosPromiseData(fetcher(`/planner/stop/task/${id}`, { method: "POST" }));
      if (!task || error) throw error;
      return task;
    } catch (error) {
      console.error(error);
    }
  };

  // const getOneOnOneEventActions = async (id: string) => {
  // TODO: types
  //   const [oneOnOne, error] = await axiosPromiseData<any>(fetcher(`/oneOnOne/${id}`, { method: "GET" }));
  //   if (!oneOnOne || error) throw error;
  //   return oneOnOne;
  // };

  const getEventActions = useCallback(async (event: Event): Promise<EventActions> => {
    const isHappening = isWithinInterval(new Date(), {
      end: new Date(event.eventEnd),
      start: new Date(event.eventStart),
    });

    console.log("### =>", isHappening);

    switch (event.assist.eventType) {
      case "TASK_ASSIGNMENT":
        return [
          isHappening
            ? {
                title: "Stop",
                action: async () => {
                  event.assist.taskId && (await handleStopTask(String(event.assist.taskId)));
                },
              }
            : {
                title: "Start",
                action: async () => {
                  event.assist.taskId && (await handleStartTask(String(event.assist.taskId)));
                },
              },

          // {
          //   title: "Complete",
          //   action: () => {
          //     //
          //   },
          // },
          // {
          //   title: "Snooze",
          //   action: () => {
          //     //
          //   },
          // },
          // {
          //   title: "Delete",
          //   action: () => {
          //     //
          //   },
          // },
        ];
      case "ONE_ON_ONE_ASSIGNMENT":
        return [
          event.onlineMeetingUrl && {
            title: "Join Meeting",
            action: () => {
              open(event.onlineMeetingUrl);
            },
          },
        ].filter(Boolean) as EventActions;
      case "HABIT_ASSIGNMENT":
        return [
          {
            title: "Start",
            action: async () => {
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
