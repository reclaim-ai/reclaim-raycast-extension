import { ActionPanel, Color, Icon, List } from "@raycast/api";
import { useEffect, useState } from "react";
import useApi from "./hooks/useApi";
import { ApiResponseEvents } from "./hooks/useApi.types";

// const items = ["Event 1", "Event 2", "Event 3", "Event 4"];

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<ApiResponseEvents>([]);

  const { getEvents } = useApi();

  useEffect(() => {
    (async () => {
      const rawData = await getEvents();
      setEvents(rawData?.data as ApiResponseEvents);
      setLoading(false);
    })();
  }, []);

  return (
    <List
      isLoading={loading}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      navigationTitle="Search events"
      searchBarPlaceholder="Search your event"
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select Todo List"
          value={"All"}
          //   onChange={(newValue) => setState((previous) => ({ ...previous, filter: newValue as Filter }))}
        >
          <List.Dropdown.Item title="All" value={"All"} />
          <List.Dropdown.Item title="Open" value={"Open"} />
          <List.Dropdown.Item title="Completed" value={"Completed"} />
        </List.Dropdown>
      }
    >
      {events.map((item) => (
        <List.Item
          key={item.eventId}
          title={item.title}
          icon={Icon.Circle}
          //   detail={item}
          accessories={[
            // { text: `An Accessory Text`, icon: Icon.Hammer },
            // { text: { value: `A Colored Accessory Text`, color: Color.Orange }, icon: Icon.Hammer },
            // { icon: Icon.Person, tooltip: "A person" },
            { date: new Date(item.eventStart) },
            // { date: new Date() },
            // { tag: new Date() },
            // { tag: { value: new Date(), color: Color.Magenta } },
            { tag: { value: item.free ? "free" : "busy", color: Color.Blue } },
          ]}
          actions={<ActionPanel>{/* <Action title="Select" onAction={() => setSearchText(item)} /> */}</ActionPanel>}
        />
      ))}
    </List>
  );
}
