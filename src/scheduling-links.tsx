import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { useSchedulingLinks } from "./hooks/useSchedulingLinks";
import { SchedulingLink } from "./types/scheduling-link";

const SLActions = ({ link }: { link: SchedulingLink }) => {
  const url = `https://app.reclaim.ai/m/${link.pageSlug}/${link.slug}`;
  return (
    <ActionPanel>
      <Action.CopyToClipboard
        title="Copy Link to Clipboard"
        content={url}
        // onAction={() => {
        //   open(`https://app.reclaim.ai/planner/eventId=${event.eventId}`);
        // }}
      />
    </ActionPanel>
  );
};

export default function Command() {
  const [searchText, setSearchText] = useState("");

  const [links, setLinks] = useState<SchedulingLink[]>([]);

  const { getSchedulingLinks } = useSchedulingLinks();

  // if (error) {
  //   return <Detail markdown={`Error while fetching user. Please, check your API token and retry.`} />;
  // }

  const fetchLinks = async () => {
    const schedulingLinks = await getSchedulingLinks();
    setLinks(schedulingLinks || []);
  };

  useEffect(() => {
    void fetchLinks();
  }, []);

  return (
    <List
      // isLoading={loading}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      navigationTitle="Search Scheduling Links"
      // searchBarPlaceholder="Search your event"
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
        {!!links.length && (
          <List.Section title="All Scheduling Links">
            {links.map((sl) => (
              <List.Item
                key={sl.id}
                title={sl.title}
                icon={{
                  source: Icon.Calendar,
                }}
                //   detail={item}
                accessories={
                  [
                    // // { text: `An Accessory Text`, icon: Icon.Hammer },
                    // // { text: { value: `A Colored Accessory Text`, color: Color.Orange }, icon: Icon.Hammer },
                    // // { icon: Icon.Person, tooltip: "A person" },
                    // { date: new Date(item.eventStart) },
                    // // { date: new Date() },
                    // // { tag: new Date() },
                    // // { tag: { value: new Date(), color: Color.Magenta } },
                    // { tag: { value: item.free ? "free" : "busy", color: Color.Blue } },
                    // // { tag: { value: item.now ? "now" : "nowNot", color: Color.Blue } },
                  ]
                }
                actions={<SLActions link={sl} />}
              />
            ))}
          </List.Section>
        )}
      </>
    </List>
  );
}
