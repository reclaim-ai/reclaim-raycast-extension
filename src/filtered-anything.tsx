import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { useDebounce } from "./hooks/useDebounce";
import useInterpreter from "./hooks/useInterpreter";

const FilteredAnything = ({ type, query }: { type: string; query: string }) => {
  const [list, setList] = useState<string[]>([]);
  const [search, setSearch] = useState<string>(query);
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const _onChangeDebounced = async (text: string) => {
    setDebouncedSearch(text);
  };

  const onChangeDebounced = useDebounce(_onChangeDebounced, 3000);

  const { sendToInterpreter } = useInterpreter();

  const fetchAnything = async () => {
    setLoading(true);
    const responses = await sendToInterpreter(type, search);
    console.log("### =>", responses?.interpretedPlans[0]);

    setLoading(false);
  };

  useEffect(() => {
    void fetchAnything();
  }, [debouncedSearch]);

  return (
    <List
      isLoading={loading}
      searchBarPlaceholder="Ask anything..."
      onSearchTextChange={(text) => {
        setSearch(text);
        onChangeDebounced(text);
      }}
      searchText={search}
    >
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
