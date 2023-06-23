import { Action, ActionPanel, Color, Detail, Icon, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { useCalendar } from "./hooks/useCalendar";
import { useEvent } from "./hooks/useEvent";
import { Event } from "./types/event";
import { eventColors } from "./utils/events";
import { EventActions } from "./hooks/useEvent.types";

const EventActionsList = ({ event }: { event: Event }) => {
  const [eventActions, setEventActions] = useState<EventActions>([]);

  const { getEventActions } = useEvent();

  const loadEventActions = async () => {
    const actions = await getEventActions(event);
    setEventActions(actions);
  };

  useEffect(() => {
    void loadEventActions();
  }, []);

  return (
    <ActionPanel>
      {eventActions.map((action) => (
        <Action
          key={action.title}
          title={action.title}
          icon={action.icon}
          onAction={() => {
            action.action();
          }}
        />
      ))}
    </ActionPanel>
  );
};

export default function Command() {
  const { loading, error, eventsNow, eventsToday, eventsTomorrow, eventNext } = useCalendar();

  if (error) {
    return <Detail markdown={`Error while fetching user. Please, check your API token and retry.`} />;
  }

  const [searchText, setSearchText] = useState("");
  const { showFormattedEventTitle, fetchEvents } = useEvent();

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
                accessories={[
                  { date: new Date(item.eventStart) },
                  { tag: { value: item.free ? "free" : "busy", color: Color.Blue } },
                ]}
                actions={<EventActionsList event={item} />}
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
              actions={<EventActionsList event={eventNext} />}
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
                actions={<EventActionsList event={item} />}
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
                actions={<EventActionsList event={item} />}
              />
            ))}
          </List.Section>
        )}
      </>
    </List>
  );
}
