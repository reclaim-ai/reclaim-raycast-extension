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
        const response = await sendToInterpreter("task", text);
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
      searchBarPlaceholder="Fold laundry, 15 min, tomorrow"
      isLoading={loading}
      onSearchTextChange={onChangeDebounced}
    >
      {list.length === 0 ? (
        <List.EmptyView
          icon={Icon.LightBulb}
          description={loading ? `Thinking...` : `“Some copy about the task creation ”`}
          title="Ask Reclaim to create a task"
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
