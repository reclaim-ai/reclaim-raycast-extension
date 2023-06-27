import { Icon, open } from "@raycast/api";
import { format, isWithinInterval } from "date-fns";
import { useCallback } from "react";
import { Event } from "../types/event";
import { axiosPromiseData } from "../utils/axiosPromise";
import { formatDisplayEventHours, formatDisplayHours } from "../utils/dates";
import { parseEmojiField } from "../utils/string";
import reclaimApi from "./useApi";
import { ApiResponseEvents, EventActions } from "./useEvent.types";
import { useUser } from "./useUser";

const useEvent = () => {
  const { fetcher } = reclaimApi();
  const { currentUser } = useUser();

  const fetchEvents = async ({ start, end }: { start: Date; end: Date }) => {
    try {
      const strStart = format(start, "yyyy-MM-dd");
      const strEnd = format(end, "yyyy-MM-dd");

      const [eventsResponse, error] = await axiosPromiseData<ApiResponseEvents>(
        fetcher("/events?sourceDetails=true", {
          method: "GET",
          params: {
            start: strStart,
            end: strEnd,
          },
        })
      );

      if (!eventsResponse || error) throw error;
      return eventsResponse;
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

  const handleStartHabit = async (id: string) => {
    try {
      const [habit, error] = await axiosPromiseData(fetcher(`/planner/start/habit/${id}`, { method: "POST" }));
      if (!habit || error) throw error;
      return habit;
    } catch (error) {
      console.error(error);
    }
  };

  const handleStopHabit = async (id: string) => {
    try {
      const [habit, error] = await axiosPromiseData(fetcher(`/planner/stop/habit/${id}`, { method: "POST" }));
      if (!habit || error) throw error;
      return habit;
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

    if (!event.assist) {
      return [
        {
          icon: Icon.Stop,
          title: "Open in calendar",
          action: () => {
            open(`https://app.reclaim.ai/planner?eventId=${event.eventId}`);
          },
        },
      ];
    }

    switch (event.assist.eventType) {
      case "TASK_ASSIGNMENT":
        return [
          isHappening
            ? {
                icon: Icon.Stop,
                title: "Stop",
                action: async () => {
                  event.assist.taskId && (await handleStopTask(String(event.assist.taskId)));
                },
              }
            : {
                icon: Icon.Play,
                title: "Start",
                action: async () => {
                  event.assist.taskId && (await handleStartTask(String(event.assist.taskId)));
                },
              },
          {
            icon: Icon.Calendar,
            title: "Open in calendar",
            action: () => {
              open(
                `https://app.reclaim.ai/planner?eventId=${event.eventId}&type=task&assignmentId=${event.assist.taskId}`
              );
            },
          },
        ];
      case "ONE_ON_ONE_ASSIGNMENT":
        return [
          event.onlineMeetingUrl && {
            icon: Icon.Video,
            title: "Join Meeting",
            action: () => {
              open(event.onlineMeetingUrl);
            },
          },
          {
            icon: Icon.Calendar,
            title: "Open in calendar",
            action: () => {
              open(
                `https://app.reclaim.ai/planner?eventId=${event.eventId}&type=one-on-one&assignmentId=${event.assist.dailyHabitId}`
              );
            },
          },
        ].filter(Boolean) as EventActions;
      case "HABIT_ASSIGNMENT":
        return [
          isHappening
            ? {
                icon: Icon.Stop,
                title: "Complete",
                action: async () => {
                  event.assist.dailyHabitId && (await handleStopHabit(String(event.assist.dailyHabitId)));
                },
              }
            : {
                icon: Icon.Play,
                title: "Start",
                action: async () => {
                  event.assist.dailyHabitId && (await handleStartHabit(String(event.assist.dailyHabitId)));
                },
              },
          {
            icon: Icon.Calendar,
            title: "Open in calendar",
            action: () => {
              open(
                `https://app.reclaim.ai/planner?eventId=${event.eventId}&type=habit&assignmentId=${event.assist.dailyHabitId}`
              );
            },
          },
        ];
      default:
        return [];
    }
  }, []);

  return {
    fetchEvents,
    getEventActions,
    showFormattedEventTitle,
  };
};

export { useEvent };
