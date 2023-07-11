import { Action, ActionPanel, Icon, List, useNavigation } from "@raycast/api";
import { useState } from "react";
import { useDebounce } from "./hooks/useDebounce";
import useInterpreter from "./hooks/useInterpreter";
import TaskForm from "./task-form";
import { TaskPlanDetails } from "./types/plan";

export type ListType = {
  uuid: string;
  title: string;
  interpreterData: TaskPlanDetails;
};

export default function Command() {
  const { push } = useNavigation();
  const { sendToInterpreter } = useInterpreter();
  const [list, setList] = useState<ListType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const _onChangeDebounced = async (text: string) => {
    try {
      setLoading(true);
      if (text !== "") {
        const response = (await sendToInterpreter("task", text)) as any;
        if (response) {
          setList(
            response.map((item) => ({
              uuid: item.id,
              title: item.planDetails.title,
              interpreterData: item.planDetails,
            }))
          );
        }
      }
    } catch (error) {
      console.error("Error while creating task", error);
    } finally {
      setLoading(false);
    }
  };

  const onChangeDebounced = useDebounce(_onChangeDebounced, 2000);

  return (
    <List
      searchBarPlaceholder="Type in your task, duration, & due date…"
      isLoading={loading}
      onSearchTextChange={onChangeDebounced}
    >
      {list.length === 0 ? (
        <List.EmptyView
          icon={{
            source: {
              light:
                "https://uploads-ssl.webflow.com/5ec848ec2b50b6cfae06f6cc/64ad8af97797f06482ba8f43_task-icon-black.png",
              dark: "https://uploads-ssl.webflow.com/5ec848ec2b50b6cfae06f6cc/64ad8af9581c1795283c0a65_task-icon-white.png",
            },
          }}
          description={
            loading
              ? `Thinking...`
              : `"Meeting prep 30min by 11am tomorrow"
"Prepare board slides 4h in a week"
"Dishes 15min this afternoon"`
          }
          title="Quickly create a Task"
        />
      ) : (
        list.map((item) => (
          <List.Item
            key={item.uuid}
            title={item.title}
            icon={Icon.LightBulb}
            actions={
              <ActionPanel>
                <Action
                  title={item.title}
                  onAction={() => {
                    push(
                      <TaskForm
                        interpreter={{
                          due: new Date(item.interpreterData.due),
                          durationTimeChunk: item.interpreterData.durationTimeChunks,
                          snoozeUntil: new Date(item.interpreterData.snoozeUntil),
                        }}
                        title={item.title}
                      />
                    );
                  }}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
