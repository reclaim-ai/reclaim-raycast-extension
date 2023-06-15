import { Action, ActionPanel, Icon, List, useNavigation } from "@raycast/api";
import { useState } from "react";
import { setTimeout } from "timers/promises";
import { FilteredAnything } from "./filtered-anything";

type ListType = {
  title: string;
  type: "tasks" | "scheduling-links";
};

export default function Command() {
  const { push } = useNavigation();
  const [list, setList] = useState<ListType[]>([]);
  const [query, setQuery] = useState<string>("");

  const delayedInput = async (input: string) => {
    setQuery(input);
    if (list.length !== 0) return;
    await setTimeout(2000);
    setList([
      {
        title: "Ask anything about Tasks",
        type: "tasks",
      },
      {
        title: "Ask anything about Scheduling Links",
        type: "scheduling-links",
      },
    ]);
  };

  return (
    <List searchBarPlaceholder="Ask anything..." onSearchTextChange={delayedInput}>
      {list.length === 0 ? (
        <List.EmptyView
          icon={Icon.LightBulb}
          description={`“Get me 2h for meeting prep in the next couple weeks”
“Make sure I exercise 3x this week in the afternoons”
“Clear my day”`}
          title="Ask Reclaim to do anything"
        />
      ) : (
        list.map((item) => (
          <List.Item
            key={item.title}
            title={item.title}
            icon={Icon.LightBulb}
            actions={
              <ActionPanel>
                <Action
                  title={item.title}
                  onAction={() => {
                    push(<FilteredAnything type={item.type} query={query} />);
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
