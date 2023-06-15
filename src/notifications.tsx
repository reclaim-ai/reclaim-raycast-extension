//

import { Cache, Icon, LaunchType, MenuBarExtra, launchCommand, open } from "@raycast/api";
import { useCalendar } from "./hooks/useCalendar";
import { eventColors } from "./utils/events";
import { parseEmojiField } from "./utils/string";

import { intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";
import { useEvent } from "./hooks/useEvent";
import { Event } from "./types/event";
import { getMiniDuration } from "./utils/dates";

const cache = new Cache();

const ActionOptionsWithContext = ({ event }: { event: Event }) => {
  const { getEventActions } = useEvent();

  const actions = getEventActions(event);

  return (
    <>
      {actions.map((action) => (
        <MenuBarExtra.Item
          key={action.title}
          title={action.title}
          // shortcut={{ modifiers: ["cmd"], key: "enter" }}
          // icon={{ source: Icon.Dot }}
          onAction={action.action}
        />
      ))}
    </>
  );
};

export default function Command() {
  const { loading, eventsNow, eventNext, eventsToday, eventsTomorrow } = useCalendar();
  const { showFormattedEventTitle } = useEvent();
  const cachedTitle = cache.get("menuBarTitle");

  const [menuBarTitle, setMenuBarTitle] = useState(cachedTitle ? cachedTitle : "No upcoming events");

  const handleOpenReclaim = () => {
    open("https://app.reclaim.ai");
  };

  const handleOpenRaycast = async () => {
    await launchCommand({ name: "my-calendar", type: LaunchType.UserInitiated });
  };

  useEffect(() => {
    if (eventsNow && eventsNow.length > 0) {
      const duration = intervalToDuration({
        start: new Date(),
        end: new Date(eventsNow[0].eventEnd),
      });
      const text = `Ends in ${getMiniDuration(duration)}: ${parseEmojiField(eventsNow[0].title).textWithoutEmoji}`;

      cache.set("menuBarTitle", text);
      setMenuBarTitle(text);
      return;
    }
    if (!!eventsNow && eventNext) {
      const duration = intervalToDuration({
        start: new Date(),
        end: new Date(eventNext.eventStart),
      });
      const text = `Starts in ${getMiniDuration(duration)}: ${parseEmojiField(eventNext.title).textWithoutEmoji}`;

      cache.set("menuBarTitle", text);
      setMenuBarTitle(text);
      return;
    }
  }, [eventsNow, eventNext]);

  return (
    <MenuBarExtra isLoading={loading} icon={"command-icon.png"} title={menuBarTitle}>
      {!!eventsNow && eventsNow.length > 0 && (
        <>
          <MenuBarExtra.Section title="Now" />
          {eventsNow.map((event) => (
            <MenuBarExtra.Submenu
              key={event.eventId}
              icon={{
                source: Icon.Dot,
                tintColor: eventColors[event.color],
              }}
              title={showFormattedEventTitle(event, true)}
            >
              <ActionOptionsWithContext event={event} />
            </MenuBarExtra.Submenu>
          ))}
        </>
      )}
      {!!eventNext && (
        <>
          <MenuBarExtra.Section title="Next" />
          <MenuBarExtra.Submenu
            icon={{
              source: Icon.Dot,
              tintColor: eventColors[eventNext.color],
            }}
            title={showFormattedEventTitle(eventNext, true)}
          >
            <ActionOptionsWithContext event={eventNext} />
          </MenuBarExtra.Submenu>
        </>
      )}
      {!!eventsToday && eventsToday.length > 0 && (
        <>
          <MenuBarExtra.Section title="Today" />
          {eventsToday.map((event) => (
            <MenuBarExtra.Submenu
              key={event.eventId}
              icon={{
                source: Icon.Dot,
                tintColor: eventColors[event.color],
              }}
              title={showFormattedEventTitle(event, true)}
            >
              <ActionOptionsWithContext event={event} />
            </MenuBarExtra.Submenu>
          ))}
        </>
      )}
      {!!eventsTomorrow && eventsTomorrow.length > 0 && (
        <>
          <MenuBarExtra.Section title="Tomorrow" />
          {eventsTomorrow.map((event) => (
            <MenuBarExtra.Submenu
              key={event.eventId}
              icon={{
                source: Icon.Dot,
                tintColor: eventColors[event.color],
              }}
              title={showFormattedEventTitle(event, true)}
            >
              <ActionOptionsWithContext event={event} />
            </MenuBarExtra.Submenu>
          ))}
        </>
      )}

      <MenuBarExtra.Separator />
      <MenuBarExtra.Item title="Open Reclaim" onAction={handleOpenReclaim} />
      <MenuBarExtra.Item title="Open Raycast" onAction={handleOpenRaycast} />
    </MenuBarExtra>
  );
}
