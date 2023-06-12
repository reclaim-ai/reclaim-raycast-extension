import { AxiosError, AxiosResponse } from "axios";

type ApiBadRequestException = { message: string; code: number };

export async function axiosPromiseData<T>(
  promise: Promise<AxiosResponse<T>>
): Promise<
  [AxiosResponse<T>["data"], null] | [null, ApiBadRequestException | undefined]
> {
  try {
    const result: Awaited<AxiosResponse<T>> = await promise;
    return [result.data, null];
  } catch (err) {
    return [null, (err as AxiosError<ApiBadRequestException>).response?.data];
  }
}

export async function axiosPromiseStatusCode<T>(
  promise: Promise<AxiosResponse<T>>
): Promise<
  [AxiosResponse<T>["status"], null] | [null, ApiBadRequestException | undefined]
> {
  try {
    const result: Awaited<AxiosResponse<T>> = await promise;
    return [result.status, null];
  } catch (err) {
    return [null, (err as AxiosError<ApiBadRequestException>).response?.data];
  }
}
