import useApi from "./useApi";

const useTask = () => {
  const { fetcher } = useApi();

  const createQuickTask = async ({ title, durationBlock }: { title: string; duration: number }) => {
    try {
      //
    } catch (error) {
      console.error(error);
    }
  };
};

export { useTask };
