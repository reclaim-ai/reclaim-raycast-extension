import { Detail, getPreferenceValues, useNavigation } from "@raycast/api";
import axios, { AxiosRequestConfig } from "axios";
import { ApiPreferences } from "./useApi.types";

const API_URL = "https://weber.api.reclaim-test.com/api";

const useApi = () => {
  const { apiToken } = getPreferenceValues<ApiPreferences>();

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

  return { fetcher };
};

export default useApi;
