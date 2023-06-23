import { popToRoot, showToast, Toast } from "@raycast/api";
import { endOfDay } from "date-fns";
import { useEffect } from "react";
import useApi from "./hooks/useApi";
import TaskForm from "./task-form";
import { axiosPromiseData } from "./utils/axiosPromise";
import { formatDuration, parseDurationToMinutes, TIME_BLOCK_IN_MINUTES } from "./utils/dates";

type Props = { arguments: { event: string; time: string } };

export default function Command(props: Props) {
  const { event, time } = props.arguments;

  const { fetcher } = useApi();

  const load = async () => {
    if (!event || !time) {
      return;
    }

    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Creating task...",
    });

    try {
      if (Number(parseDurationToMinutes(time)) % 15 !== 0) {
        toast.style = Toast.Style.Failure;
        toast.title = "Time must be in a interval of 15 minutes. (15/30/45/60...)";
        return;
      }

      if (time.replace(/(\s|^)\d+(\s|$)/g, "") === "") {
        toast.style = Toast.Style.Failure;
        toast.title = "Please provide a valid time (hours/min)";
        return;
      }

      const durationBlock = Number(parseDurationToMinutes(formatDuration(time))) / TIME_BLOCK_IN_MINUTES;

      const data = {
        title: event,
        eventCategory: "WORK",
        timeChunksRequired: durationBlock,
        snoozeUntil: new Date().toJSON(),
        due: endOfDay(new Date()).toJSON(),
        minChunkSize: durationBlock,
        maxChunkSize: durationBlock,
        alwaysPrivate: true,
      };

      console.log("### => [POST] /tasks", data);

      const [task, error] = await axiosPromiseData(
        fetcher("/tasks", {
          method: "POST",
          data,
        })
      );

      console.log("### => [RESPONSE] /tasks", task);

      if (!task && error) throw error;

      toast.style = Toast.Style.Success;
      toast.title = "Task created!";
      popToRoot();
    } catch (err) {
      console.error(err);

      toast.style = Toast.Style.Failure;
      toast.title = "Failed to create task";
      if (err instanceof Error) {
        toast.message = err.message;
      }
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return <TaskForm title={event} timeNeeded={time} />;
}
