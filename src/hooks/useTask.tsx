import { axiosPromiseData } from "../utils/axiosPromise";
import reclaimApi from "./useApi";
import { ApiResponseTasks, CreateTaskProps } from "./useTask.types";

const useTask = () => {
  const { fetcher } = reclaimApi();

  const createTask = async (task: CreateTaskProps) => {
    try {
      const data = {
        title: task.title,
        eventCategory: "WORK",
        timeChunksRequired: task.timeNeeded,
        snoozeUntil: task.snoozeUntil,
        due: task.due,
        minChunkSize: task.durationMin,
        maxChunkSize: task.durationMax,
        notes: task.notes,
        alwaysPrivate: true,
      };
      console.log("### => [POST] /tasks", data);

      const [createdTask, error] = await axiosPromiseData(
        fetcher("/tasks", {
          method: "POST",
          data,
        })
      );
      if (!createTask && error) throw error;

      console.log("### => [POST] /tasks", createdTask);
      return createdTask;
    } catch (error) {
      console.error(error);
    }
  };

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

  const fetchTasks = async () => {
    try {
      const [tasks, error] = await axiosPromiseData<ApiResponseTasks>(fetcher("/tasks"));
      if (!tasks && error) throw error;
      return tasks;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    createTask,
    fetchTasks,
    handleStartTask,
    handleStopTask,
  };
};

export { useTask };
