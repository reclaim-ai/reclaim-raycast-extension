import { addDays, endOfDay, format } from "date-fns";
import { axiosPromiseData } from "../utils/axiosPromise";
import reclaimApi from "./useApi";
import { ApiResponseEvents } from "./useEvent.types";

const useEvent = () => {
  const { fetcher } = reclaimApi();

  const getEvents = async () => {
    try {
      const start = format(new Date(), "yyyy-MM-dd");
      const end = format(endOfDay(addDays(new Date(), 2)), "yyyy-MM-dd");

      const [events, error] = await axiosPromiseData<ApiResponseEvents>(
        fetcher("/events", {
          method: "GET",
          params: { start, end },
        })
      );

      if (!events || error) throw error;

      return events;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getEvents,
  };
};

export { useEvent };
