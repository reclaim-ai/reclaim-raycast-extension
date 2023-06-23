import { Detail, getPreferenceValues, useNavigation } from "@raycast/api";
import axios, { AxiosRequestConfig } from "axios";
import { NativePreferences } from "../types/preferences";


const useApi = () => {
  const { apiToken, apiUrl } = getPreferenceValues<NativePreferences>();

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
      baseURL: apiUrl,
      headers,
      timeout: 20000,
    });
  };

  return { fetcher };
};

export default useApi;
