//

import { Icon, LaunchType, MenuBarExtra, launchCommand, open } from "@raycast/api";

export default function Command() {
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
      tooltip="Reclaim.ai"
    >
      <MenuBarExtra.Section title="Ending in 30 min" />
      <MenuBarExtra.Item
        icon={{
          source: Icon.Dot,
          tintColor: "#FF0000",
        }}
        title="Some event"
        onAction={handleOpenReclaim}
      />
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
