import { getPreferenceValues } from "@raycast/api";
import { NativePreferences } from "../types/preferences";
import { axiosPromiseData } from "../utils/axiosPromise";
import reclaimApi from "./useApi";
import { CreateTaskProps } from "./useTask.types";

const useTask = () => {
  const { fetcher } = reclaimApi();
  const { preferredTimePolicy } = getPreferenceValues<NativePreferences>();

  // const { currentUser } = useUser();

  const createTask = async (task: CreateTaskProps) => {
    try {
      const [createdTask, error] = await axiosPromiseData(
        fetcher("/tasks", {
          method: "POST",
          data: {
            title: task.title,
            // eventColor: "",
            eventCategory: preferredTimePolicy || "WORK",
            timeChunksRequired: task.timeNeeded,
            snoozeUntil: task.snoozeUntil,
            due: task.due,
            minChunkSize: task.durationMin,
            maxChunkSize: task.durationMax,
            notes: task.notes,
            // priority: "",
            alwaysPrivate: true,
          },
        })
      );
      if (!createTask && error) throw error;
      return createdTask;
    } catch (error) {
      console.error(error);
    }
  };

  // const createQuickTask = async ({ title, durationBlock }: { title: string; durationBlock: number }) => {
  //   try {
  //     const [task, error] = await axiosPromiseData(
  //       fetcher("/tasks", {
  //         method: "POST",
  //         data: {
  //           title: title,
  //           // eventColor: "",
  //           eventCategory: preferredTimePolicy,
  //           timeChunksRequired: durationBlock,
  //           snoozeUntil: new Date().toJSON(),
  //           due: endOfDay(new Date()).toJSON(),
  //           minChunkSize: durationBlock,
  //           maxChunkSize: durationBlock,
  //           // notes: "",
  //           // priority: "",
  //           alwaysPrivate: true,
  //         },
  //       })
  //     );
  //     if (!task && error) throw error;
  //     return task;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return {
    // createQuickTask,
    createTask,
  };
};

export { useTask };
