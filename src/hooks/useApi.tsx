import { Detail, getPreferenceValues, useNavigation } from "@raycast/api";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { endOfTomorrow, format } from "date-fns";
import { ApiResponseEvents, ApiResponseInterpreter } from "./useApi.types";

interface Preferences {
  apiToken: string;
}

const API_URL = "https://weber.api.reclaim-test.com/api";

const useApi = () => {
  const { apiToken } = getPreferenceValues<Preferences>();

  const { push } = useNavigation();

  if (!apiToken) {
    push(
      <Detail markdown={"Something wrong with your API Token key. Check your raycast config and set up a new token."} />
    );
  }

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

  const sendToInterpreter = async (category: string, message: string) => {
    try {
      return await fetcher<ApiResponseInterpreter>("/interpreter/message", {
        method: "POST",
        data: {
          message,
          category,
        },
      });
    } catch (error) {
      console.log((error as AxiosError).response?.data);
    }
  };

  const getEvents = async () => {
    try {
      return await fetcher<ApiResponseEvents>("/events", {
        method: "GET",
        params: {
          start: format(new Date(), "yyyy-MM-dd"),
          end: format(endOfTomorrow(), "yyyy-MM-dd"),
        },
      });
    } catch (error) {
      console.log((error as AxiosError).response?.data);
    }
  };

  return { sendToInterpreter, getEvents };
};

export default useApi;
