import { Action, ActionPanel, Color, Detail, Icon, List, Toast, open, showToast } from "@raycast/api";
import { useEffect, useState } from "react";
import { useEvent } from "./hooks/useEvent";
import { useUser } from "./hooks/useUser";
import { sortEvents } from "./utils/arrays";
import { formatDisplayEventDate } from "./utils/dates";
import { eventColors } from "./utils/events";
import { Event } from "./types/event";

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
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  const { currentUser: user, isLoading: isLoadingUser } = useUser();
  const { getEvents } = useEvent();

  // const filteredEvents = events.filter((event) => event.title.toLowerCase().includes(searchText.toLowerCase()));

  const showFormattedEventTitle = (event: Event) => {
    return `${formatDisplayEventDate({
      start: new Date(event.eventStart),
      end: new Date(event.eventEnd),
      hoursFormat: user?.settings.format24HourTime ? "24h" : "12h",
    })}  ${event.title}`;
  };

  const parsedEvents = events
    .filter((event) => {
      const isPast = new Date(event.eventEnd).valueOf() < new Date().valueOf();
      return !isPast;
    })
    .map((event) => {
      const endsInFuture = new Date(event.eventEnd).valueOf() > new Date().valueOf();
      const startsInPast = new Date(event.eventStart).valueOf() < new Date().valueOf();

      const isNow = startsInPast && endsInFuture;
      const isToday = new Date(event.eventStart).getDate() === new Date().getDate();
      const isTomorrow = new Date(event.eventStart).getDate() === new Date().getDate() + 1;

      return { ...event, section: isNow ? "NOW" : isTomorrow ? "TOMORROW" : isToday ? "TODAY" : "OTHER" };
    })
    .sort(sortEvents);

  const eventsNow = parsedEvents.filter((event) => event.section === "NOW");
  const [eventNext, ...eventsToday] = parsedEvents.filter((event) => event.section === "TODAY");
  const eventsTomorrow = parsedEvents.filter((event) => event.section === "TOMORROW");
  // const eventsOther = parsedEvents.filter((event) => event.section === "OTHER");

  useEffect(() => {
    (async () => {
      setLoading(true);
      await showToast({
        style: Toast.Style.Animated,
        title: "Loading calendar...",
      });

      const events = await getEvents();
      setEvents(events || []);

      setLoading(false);
      await showToast({
        style: Toast.Style.Success,
        title: "Loaded!",
      });
    })();
  }, []);

  if (!user && !loading && !isLoadingUser) {
    return <Detail markdown={`Error while fetching user. Please, check your API token and retry.`} />;
  }

  return (
    <List
      isLoading={loading || isLoadingUser}
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
