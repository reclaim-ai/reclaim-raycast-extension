import { Action, ActionPanel, Color, Detail, Icon, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { useCalendar } from "./hooks/useCalendar";
import { useEvent } from "./hooks/useEvent";
import { Event } from "./types/event";
import { eventColors } from "./utils/events";
import { EventActions } from "./hooks/useEvent.types";
import { addDays } from "date-fns";

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
  const { loading, eventsNow, eventsToday, eventsTomorrow, eventNext, eventsOther } = useCalendar();

  const [searchText, setSearchText] = useState("");
  const { showFormattedEventTitle, fetchEvents } = useEvent();

  useEffect(() => {
    void fetchEvents({
      start: new Date(),
      end: addDays(new Date(), 7),
    });
  }, []);

  return (
    <List
      filtering={true}
      isLoading={loading}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      navigationTitle="Search events"
      searchBarPlaceholder="Search your event"
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
        {!!eventsOther.length && (
          <List.Section title="Following days">
            {eventsOther.map((item) => (
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
