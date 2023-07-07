// import { popToRoot, showToast, Toast } from "@raycast/api";
// import { addDays, addMinutes, endOfDay } from "date-fns";
// import { axiosPromiseData, fetcher } from "./utils/axiosPromise";
// import { formatDuration, parseDurationToMinutes, TIME_BLOCK_IN_MINUTES } from "./utils/dates";
// import { ApiResponseUser } from "./hooks/useUser.types";

// type Props = { arguments: { event: string; time: string } };

// export default async function Command(props: Props) {
//   const { event, time } = props.arguments;

//   if (!event || !time) {
//     return;
//   }

//   const toast = await showToast({
//     style: Toast.Style.Animated,
//     title: "Creating task...",
//   });

//   try {
//     if (Number(parseDurationToMinutes(time)) % 15 !== 0) {
//       toast.style = Toast.Style.Failure;
//       toast.title = "Time must be in a interval of 15 minutes. (15/30/45/60...)";
//       return;
//     }

//     if (time.replace(/(\s|^)\d+(\s|$)/g, "") === "") {
//       toast.style = Toast.Style.Failure;
//       toast.title = "Please provide a valid time. (hours/min)";
//       return;
//     }

//     const durationBlock = Number(parseDurationToMinutes(formatDuration(time))) / TIME_BLOCK_IN_MINUTES;

//     const [user, userError] = await axiosPromiseData<ApiResponseUser>(fetcher("/users/current"));

//     if (!user && userError) {
//       toast.style = Toast.Style.Failure;
//       toast.title = "Failed to get user info. Please check your settings.";
//       return;
//     }

//     const userDefaults = {
//       defaultDueDate: addDays(new Date(), user?.features.taskSettings.defaults.dueInDays || 0),
//       defaultSnoozeDate: addMinutes(new Date(), user?.features.taskSettings.defaults.delayedStartInMinutes || 0),
//       minDuration: (user?.features.taskSettings.defaults.minChunkSize || 1) * TIME_BLOCK_IN_MINUTES,
//       maxDuration: (user?.features.taskSettings.defaults.maxChunkSize || 1) * TIME_BLOCK_IN_MINUTES,
//       duration: (user?.features.taskSettings.defaults.timeChunksRequired || 1) * TIME_BLOCK_IN_MINUTES,
//       category: user?.features.taskSettings.defaults.category || "WORK",
//       private: user?.features.taskSettings.defaults.alwaysPrivate || true,
//     };

//     const data = {
//       title: event,
//       eventCategory: userDefaults.category,
//       timeChunksRequired: durationBlock,
//       snoozeUntil: userDefaults.defaultSnoozeDate.toJSON(),
//       due: userDefaults.defaultDueDate.toJSON(),
//       minChunkSize: userDefaults.minDuration,
//       maxChunkSize: userDefaults.maxDuration,
//       alwaysPrivate: userDefaults.private,
//     };

//     console.log("### => [POST] /tasks", data);

//     const [task, error] = await axiosPromiseData(
//       fetcher("/tasks", {
//         method: "POST",
//         data,
//       })
//     );

//     console.log("### => [RESPONSE] /tasks", task);

//     if (!task && error) throw error;

//     toast.style = Toast.Style.Success;
//     toast.title = "Task created!";
//     popToRoot();
//   } catch (err) {
//     console.error("Error while creating task", err);

//     toast.style = Toast.Style.Failure;
//     toast.title = "Failed to create task";
//     if (err instanceof Error) {
//       toast.message = err.message;
//     }
//   }
// }

import { Action, ActionPanel, Icon, List, useNavigation } from "@raycast/api";
import { useState } from "react";
import { useDebounce } from "./hooks/useDebounce";
import TaskForm from "./task-form";

export type ListType = {
  title: string;
  type: "task" | "scheduling-link";
};

export default function Command() {
  const { push } = useNavigation();
  const [list, setList] = useState<ListType[]>([]);
  const [query, setQuery] = useState<string>("");

  const _onChangeDebounced = async (text: string) => {
    if (text !== "") {
      console.log("### =>", text);
    }
  };

  const onChangeDebounced = useDebounce(_onChangeDebounced, 1000);

  return (
    <List searchBarPlaceholder="Fold laundry, 15 min, tomorrow" onSearchTextChange={onChangeDebounced}>
      {list.length === 0 ? (
        <List.EmptyView
          icon={Icon.LightBulb}
          description={`“Some copy about the task creation ”`}
          title="Ask Reclaim to create a task"
        />
      ) : (
        list.map((item) => (
          <List.Item
            key={item.title}
            title={item.title}
            icon={Icon.LightBulb}
            actions={
              <ActionPanel>
                <Action
                  title={item.title}
                  onAction={() => {
                    push(<TaskForm />);
                  }}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
