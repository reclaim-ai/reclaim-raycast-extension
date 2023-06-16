import { Action, ActionPanel, Color, Detail, Icon, List, open } from "@raycast/api";
import { useEffect, useState } from "react";
import { useCalendar } from "./hooks/useCalendar";
import { Event } from "./types/event";
import { eventColors } from "./utils/events";
import { useEvent } from "./hooks/useEvent";

const EventActions = ({ event }: { event: Event }) => {
  return (
    <ActionPanel>
      <Action
        icon={{
          source: "command-icon.png",
        }}
        title="Open in Reclaim"
        onAction={() => {
          open(`https://app.reclaim.ai/planner/eventId=${event.eventId}`);
        }}
      />
    </ActionPanel>
  );
};

export default function Command() {
  const [searchText, setSearchText] = useState("");

  const { loading, error, eventsNow, eventsToday, eventsTomorrow, eventNext } = useCalendar();
  const { showFormattedEventTitle, fetchEvents } = useEvent();

  if (error) {
    return <Detail markdown={`Error while fetching user. Please, check your API token and retry.`} />;
  }

  useEffect(() => {
    void fetchEvents();
  }, []);

  return (
    <List
      filtering={true}
      isLoading={loading}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      navigationTitle="Search events"
      searchBarPlaceholder="Search your event"
      // searchBarAccessory={
      //   <List.Dropdown
      //     tooltip="Select Todo List"
      //     value={"All"}
      //     //   onChange={(newValue) => setState((previous) => ({ ...previous, filter: newValue as Filter }))}
      //   >
      //     <List.Dropdown.Item title="All" value={"All"} />
      //     <List.Dropdown.Item title="Open" value={"Open"} />
      //     <List.Dropdown.Item title="Completed" value={"Completed"} />
      //   </List.Dropdown>
      // }
    >
      <>
        {!!eventsNow.length && (
          <List.Section title="Now">
            {eventsNow.map((item) => (
              <List.Item
                key={item.eventId}
                title={showFormattedEventTitle(item)}
                icon={{
                  tintColor: eventColors[item.color],
                  source: Icon.Dot,
                }}
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
                  // { tag: { value: item.now ? "now" : "nowNot", color: Color.Blue } },
                ]}
                actions={<EventActions event={item} />}
              />
            ))}
          </List.Section>
        )}
        {!!eventNext && (
          <List.Section title="Next">
            <List.Item
              key={eventNext.eventId}
              title={showFormattedEventTitle(eventNext)}
              icon={{
                tintColor: eventColors[eventNext.color],
                source: Icon.Dot,
              }}
              accessories={[
                { date: new Date(eventNext.eventStart) },
                { tag: { value: eventNext.free ? "free" : "busy", color: Color.Blue } },
              ]}
            />
          </List.Section>
        )}
        {!!eventsToday.length && (
          <List.Section title="Today">
            {eventsToday.map((item) => (
              <List.Item
                key={item.eventId}
                title={showFormattedEventTitle(item)}
                icon={{
                  tintColor: eventColors[item.color],
                  source: Icon.Dot,
                }}
                accessories={[
                  { date: new Date(item.eventStart) },
                  { tag: { value: item.free ? "free" : "busy", color: Color.Blue } },
                ]}
              />
            ))}
          </List.Section>
        )}
        {!!eventsTomorrow.length && (
          <List.Section title="Tomorrow">
            {eventsTomorrow.map((item) => (
              <List.Item
                key={item.eventId}
                title={showFormattedEventTitle(item)}
                icon={{
                  tintColor: eventColors[item.color],
                  source: Icon.Dot,
                }}
                accessories={[
                  { date: new Date(item.eventStart) },
                  { tag: { value: item.free ? "free" : "busy", color: Color.Blue } },
                ]}
              />
            ))}
          </List.Section>
        )}
      </>
    </List>
  );
}
