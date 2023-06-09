import { Action, ActionPanel, Icon, List, Toast, showToast } from "@raycast/api";
import { useEffect, useState } from "react";
import useApi from "./hooks/useApi";
import { ApiResponseInterpreter } from "./hooks/useApi.types";

export default (props: { arguments: { event: string; time: string } }) => {
  const { event, time } = props.arguments;
  const { sendToInterpreter } = useApi();

  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<undefined | ApiResponseInterpreter>();

  useEffect(() => {
    (async () => {
      await showToast({
        style: Toast.Style.Animated,
        title: "Processing information...",
      });

      const rawData = await sendToInterpreter("task", `Create task ${event} ${time}`);
      setResponse(rawData?.data);
      setLoading(false);

      await showToast({
        style: Toast.Style.Success,
        title: "Loaded!",
        message: "message loaded",
        primaryAction: {
          title: "Test action",
          onAction: (toast) => {
            console.log("The toast action has been triggered");
            toast.hide();
          },
        },
      });
    })();
  }, []);

  const handleCreateTask = (planUuid: string) => {
    console.log("create task");
  };

  return (
    <List
      isLoading={loading}
      // searchText={searchText}
      // onSearchTextChange={setSearchText}
      // navigationTitle="Select option"
      searchBarPlaceholder="Select Option"
    >
      {response &&
        response.interpretedPlans.map((item) => (
          <List.Item
            key={item.uuid}
            title={item.description}
            // icon={Icon.Circle}
            //   detail={item}
            // accessories={[
            //   // { text: `An Accessory Text`, icon: Icon.Hammer },
            //   // { text: { value: `A Colored Accessory Text`, color: Color.Orange }, icon: Icon.Hammer },
            //   // { icon: Icon.Person, tooltip: "A person" },
            //   { date: new Date(item.eventStart) },
            //   // { date: new Date() },
            //   // { tag: new Date() },
            //   // { tag: { value: new Date(), color: Color.Magenta } },
            //   { tag: { value: item.free ? "free" : "busy", color: Color.Blue } },
            // ]}
            actions={
              <ActionPanel>
                <Action icon={Icon.Check} title="Create Task" onAction={() => handleCreateTask(item.uuid)} />
                <Action icon={Icon.Multiply} title="Never Mind" />
              </ActionPanel>
            }
          />
        ))}
    </List>
  );
};
