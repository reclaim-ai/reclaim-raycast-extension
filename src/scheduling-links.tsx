import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { useSchedulingLinks } from "./hooks/useSchedulingLinks";
import { SchedulingLink } from "./types/scheduling-link";

const SLActions = ({ link }: { link: SchedulingLink }) => {
  const url = `https://app.reclaim.ai/m/${link.pageSlug}/${link.slug}`;
  return (
    <ActionPanel>
      <Action.CopyToClipboard title="Copy Link to Clipboard" content={url} />
      {/* <Action.Open title="Create One Off Link" target={url} /> */}
      <Action.Open title="Open in Browser" target={url} />
    </ActionPanel>
  );
};

export default function Command() {
  const [searchText, setSearchText] = useState("");

  const [links, setLinks] = useState<SchedulingLink[]>([]);
  const [loading, setIsLoading] = useState<boolean>(false);

  const { getSchedulingLinks } = useSchedulingLinks();

  const fetchLinks = async () => {
    setIsLoading(true);
    const schedulingLinks = await getSchedulingLinks();
    setLinks(schedulingLinks || []);
    setIsLoading(false);
  };

  useEffect(() => {
    void fetchLinks();
  }, []);

  return (
    <List
      isLoading={loading}
      filtering={true}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      navigationTitle="Search Scheduling Links"
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
                actions={<SLActions link={sl} />}
              />
            ))}
          </List.Section>
        )}
      </>
    </List>
  );
}
