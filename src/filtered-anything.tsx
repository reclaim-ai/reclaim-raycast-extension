import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useState } from "react";
import { setTimeout } from "timers/promises";

const FilteredAnything = ({ type, query }: { type: string; query: string }) => {
  const [list, setList] = useState<string[]>([]);
  const [search, setSearch] = useState<string>(query);

  return (
    <List searchBarPlaceholder="Ask anything..." searchText={search} onSearchTextChange={setSearch}>
      {list.length === 0 ? (
        <List.EmptyView icon={Icon.LightBulb} title={`Ask Reclaim to do anything related to ${type}.`} />
      ) : (
        list.map((item) => (
          <List.Item
            key={item}
            title={item}
            icon={Icon.LightBulb}
            actions={
              <ActionPanel>
                <Action
                  title={item}
                  onAction={() => {
                    //
                  }}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
};

export { FilteredAnything };
