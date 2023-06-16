import { popToRoot, showToast, Toast, useNavigation } from "@raycast/api";
import { endOfDay } from "date-fns";
import { useEffect } from "react";
import { axiosPromiseData } from "./utils/axiosPromise";
import { formatDuration, parseDurationToMinutes, TIME_BLOCK_IN_MINUTES } from "./utils/dates";
import useApi from "./hooks/useApi";
import TaskForm from "./task-form";

type Props = { arguments: { event: string; time: string } };

export default function Command(props: Props) {
  const { event, time } = props.arguments;

  const { fetcher } = useApi();
  const { push } = useNavigation();

  const load = async () => {
    const launchFullForm = ({ title, time }: { title: string; time: string }) => {
      push(<TaskForm title={title} timeNeeded={time} />);
    };

    if (!event || !time) {
      return launchFullForm({
        title: "",
        time: "",
      });
    }

    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Creating task...",
    });

    try {
      if (Number(parseDurationToMinutes(time)) % 15 !== 0) {
        toast.style = Toast.Style.Failure;
        toast.title = "Time must be in a interval of 15 minutes. (15/30/45/60...)";
        launchFullForm({ title: event, time });
        return;
      }

      if (time.replace(/(\s|^)\d+(\s|$)/g, "") === "") {
        toast.style = Toast.Style.Failure;
        toast.title = "Please provide a valid time (hours/min)";
        launchFullForm({ title: event, time });
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

  return <TaskForm />;
}
