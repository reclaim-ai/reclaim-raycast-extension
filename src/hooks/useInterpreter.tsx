import { axiosPromiseData } from "../utils/axiosPromise";
import useApi from "./useApi";
import { ApiResponseInterpreter } from "./useInterpreter.types";

const useInterpreter = () => {
  const { fetcher } = useApi();

  const sendToInterpreter = async (category: string, message: string) => {
    try {
      const data = {
        message,
        category,
      };

      console.log("### => [POST] interpreter", data);

      const [response, error] = await axiosPromiseData<ApiResponseInterpreter>(
        fetcher("/interpreter/message", {
          method: "POST",
          data,
        })
      );
      if (!response || error) throw error;

      return response.interpretedPlans;
    } catch (error) {
      console.error("Error while sending message to interpreter", error);
    }
  };

  const confirmInterpreterMessage = async (planUuid: string) => {
    try {
      // TODO: add type
      const rawRequest = await fetcher(`/interpreter/plans/applied/${planUuid}`, {
        method: "POST",
      });
      return { statusCode: rawRequest.status };
    } catch (error) {
      console.error("Error while confirming interpreter message", error);
    }
  };

  return {
    sendToInterpreter,
    confirmInterpreterMessage,
  };
};

export default useInterpreter;
