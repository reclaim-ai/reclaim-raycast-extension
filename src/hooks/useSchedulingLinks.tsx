import { axiosPromiseData } from "../utils/axiosPromise";
import reclaimApi from "./useApi";
import { ApiSchedulingLink } from "./useSchedulingLink.types";

const useSchedulingLinks = () => {
  const { fetcher } = reclaimApi();

  const getSchedulingLinks = async () => {
    try {
      const [schedulingLinks, error] = await axiosPromiseData<ApiSchedulingLink>(
        fetcher("/scheduling-link", {
          method: "GET",
        })
      );
      if (!schedulingLinks || error) throw error;
      return schedulingLinks;
    } catch (error) {
      console.error("SL ERROR:", error);
    }
  };

  return {
    getSchedulingLinks,
  };
};

export { useSchedulingLinks };
