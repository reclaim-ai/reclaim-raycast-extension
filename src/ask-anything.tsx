import { Icon, List } from "@raycast/api";

export default function Command() {
  return (
    <List searchBarPlaceholder="Ask anything...">
      <List.EmptyView
        icon={Icon.LightBulb}
        description={`“Get me 2h for meeting prep in the next couple weeks”
“Make sure I exercise 3x this week in the afternoons”
“Clear my day”`}
        title="Ask Reclaim to do anything"
      />
    </List>
  );
}
