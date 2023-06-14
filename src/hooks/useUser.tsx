import { useCallback, useEffect, useState } from "react";
import { User } from "../types/user";
import { axiosPromiseData } from "../utils/axiosPromise";
import reclaimApi from "./useApi";
import { ApiResponseUser } from "./useUser.types";

const useUser = () => {
  const { fetcher } = reclaimApi();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleGetUser = useCallback(async () => {
    try {
      if (currentUser) return;
      setIsLoading(true);
      const [user, error] = await axiosPromiseData<ApiResponseUser>(fetcher("/users/current"));

      if (!user || error) throw error;

      setCurrentUser(user);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    void handleGetUser();
  }, []);

  return {
    currentUser,
    isLoading,
  };
};

export { useUser };
