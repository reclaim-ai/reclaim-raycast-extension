import { getPreferenceValues, showToast, Toast } from "@raycast/api";
import axios, { AxiosRequestConfig } from "axios";
import { endOfDay } from "date-fns";
import { API_URL } from "./hooks/useApi";
import { NativePreferences } from "./types/preferences";
import { axiosPromiseData } from "./utils/axiosPromise";
import { formatDuration, parseDurationToMinutes, TIME_BLOCK_IN_MINUTES } from "./utils/dates";

type Props = { arguments: { event: string; time: string } };

export default async function Command(props: Props) {
  const { event, time } = props.arguments;

  const { apiToken, preferredTimePolicy } = getPreferenceValues<NativePreferences>();

  const fetcher = async <T,>(url: string, options?: AxiosRequestConfig) => {
    const headers = {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    return await axios<T>(url, {
      ...options,
      baseURL: API_URL,
      headers,
      timeout: 20000,
    });
  };

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

    const [task, error] = await axiosPromiseData(
      fetcher("/tasks", {
        method: "POST",
        data: {
          title: event,
          // eventColor: "",
          eventCategory: preferredTimePolicy || "WORK",
          timeChunksRequired: durationBlock,
          snoozeUntil: new Date().toJSON(),
          due: endOfDay(new Date()).toJSON(),
          minChunkSize: durationBlock,
          maxChunkSize: durationBlock,
          // notes: "",
          // priority: "",
          alwaysPrivate: true,
        },
      })
    );

    console.log("### =>", task);

    if (!task && error) throw error;

    toast.style = Toast.Style.Success;
    toast.title = "Task created!";
  } catch (err) {
    console.error(err);

    toast.style = Toast.Style.Failure;
    toast.title = "Failed to create task";
    if (err instanceof Error) {
      toast.message = err.message;
    }
  }
}
