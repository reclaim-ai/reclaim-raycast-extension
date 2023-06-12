import { useEffect, useState } from "react";
import { User } from "../types/user";
import { axiosPromiseData } from "../utils/axiosPromise";
import useApi from "./useApi";
import { ApiResponseUser } from "./useUser.types";

const useUser = () => {
  const { fetcher } = useApi();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleGetUser = async () => {
    try {
      setIsLoading(true);
      const [user, error] = await axiosPromiseData<ApiResponseUser>(fetcher("/users/current"));

      if (!user || error) throw error;

      setCurrentUser(user);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void handleGetUser();
  }, []);

  return {
    currentUser,
    isLoading,
  };
};

export { useUser };
