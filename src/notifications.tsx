//

import { Icon, LaunchType, MenuBarExtra, launchCommand, open } from "@raycast/api";
import { useCalendar } from "./hooks/useCalendar";
import { eventColors } from "./utils/events";
import { parseEmojiField } from "./utils/string";
import { EventType } from "./types/event";

const ActionOptionsWithContext = ({ type, eventId }: { type: EventType; eventId: string }) => {
  if (type === "WORK") {
    return (
      <MenuBarExtra.Item
        title="Complete task"
        onAction={() => {
          //
        }}
      />
    );
  }
  if (type === "MEETING") {
    return (
      <MenuBarExtra.Item
        title="Join meeting"
        onAction={() => {
          //
        }}
      />
    );
  }
  return <></>;
};

export default function Command() {
  const { loading, error, eventsNow, eventNext, eventsTomorrow } = useCalendar();

  const handleOpenReclaim = () => {
    open("https://app.reclaim.ai");
  };

  const handleOpenRaycast = async () => {
    await launchCommand({ name: "list-events", type: LaunchType.UserInitiated });
  };

  const handleTitle = parseEmojiField(
    eventsNow[0] ? eventsNow[0].title : eventNext ? eventNext.title : "No events"
  ).textWithoutEmoji;

  return (
    <MenuBarExtra isLoading={loading} icon={"command-icon.png"} title={loading ? "Loading..." : handleTitle}>
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
              title={parseEmojiField(event.title).textWithoutEmoji}
            >
              <ActionOptionsWithContext type={event.type} eventId={event.eventId} />
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
            title={parseEmojiField(eventNext.title).textWithoutEmoji}
          >
            <ActionOptionsWithContext type={eventNext.type} eventId={eventNext.eventId} />
          </MenuBarExtra.Submenu>
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
              title={parseEmojiField(event.title).textWithoutEmoji}
            >
              <ActionOptionsWithContext type={event.type} eventId={event.eventId} />
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

function Command2() {
  const handleOpenReclaim = () => {
    open("https://app.reclaim.ai");
  };

  const handleOpenRaycast = async () => {
    await launchCommand({ name: "list-events", type: LaunchType.UserInitiated });
  };

  return (
    <MenuBarExtra
      icon={"command-icon.png"}
      // title="Upcoming in 15 min: Talk w/ Henry"
      // icon={{
      //   source: Icon.Dot,
      //   tintColor: "#FF0000",
      // }}
      title="Ending in 30 min: Some event"
      tooltip="Reclaim.ai"
    >
      <MenuBarExtra.Section title="Ending in 30 min" />
      <MenuBarExtra.Submenu
        icon={{
          source: Icon.Dot,
          tintColor: "#FF0000",
        }}
        title="Some event"
        // onAction={handleOpenReclaim}
      >
        <MenuBarExtra.Item title="Join meeting" onAction={handleOpenReclaim} />
        <MenuBarExtra.Item title="Open in Google Calendar" onAction={handleOpenReclaim} />
      </MenuBarExtra.Submenu>
      <MenuBarExtra.Section title="Next" />
      <MenuBarExtra.Item
        icon={{
          source: Icon.Dot,
          tintColor: "#00FF00",
        }}
        title="Next event 1"
        onAction={handleOpenReclaim}
      />
      <MenuBarExtra.Item
        icon={{
          source: Icon.Dot,
          tintColor: "#FFFF00",
        }}
        title="Next event 2"
        onAction={handleOpenReclaim}
      />
      <MenuBarExtra.Section title="Tomorrow" />
      <MenuBarExtra.Item
        icon={{
          source: Icon.Dot,
          tintColor: "#2f2f2f",
        }}
        title="Tomorrow event"
        onAction={handleOpenReclaim}
      />
      <MenuBarExtra.Separator />
      <MenuBarExtra.Item title="Open Reclaim" onAction={handleOpenReclaim} />
      <MenuBarExtra.Item title="Open Raycast" onAction={handleOpenRaycast} />
      {/* <MenuBarExtra.Item title="Current meeting"  />
      <MenuBarExtra.Item
        title="Join videoconference"
        onAction={() => {
          console.log("seen pull request clicked");
        }}
      />

      <MenuBarExtra.Item title="----------" />
      <MenuBarExtra.Item
        title="Some important meeting."
        onAction={() => {
          console.log("seen pull request clicked");
        }}
      />
      <MenuBarExtra.Item title="Current task" />
      <MenuBarExtra.Item
        title="some task here?"
        onAction={() => {
          console.log("unseen pull request clicked");
        }}
      /> */}
    </MenuBarExtra>
  );
}
