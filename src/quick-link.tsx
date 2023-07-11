import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useState } from "react";
import { useDebounce } from "./hooks/useDebounce";
import useInterpreter from "./hooks/useInterpreter";
import { Plan, SchedulingLinkPlanDetails } from "./types/plan";

export type ListType = {
  uuid: string;
  title: string;
  interpreterData: SchedulingLinkPlanDetails;
};

export default function Command() {
  const { sendToInterpreter } = useInterpreter();
  const [list, setList] = useState<ListType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const _onChangeDebounced = async (text: string) => {
    try {
      setLoading(true);
      if (text !== "") {
        const response = (await sendToInterpreter("scheduling-link", text)) as Plan<SchedulingLinkPlanDetails>[];
        console.log("### =>", response);

        if (response) {
          setList(
            response.map((plan) => ({
              uuid: plan.id,
              title: plan.planDetails.title,
              interpreterData: plan.planDetails,
            }))
          );
        }
      }
    } catch (error) {
      console.error("Error while creating Scheduling Link", error);
    } finally {
      setLoading(false);
    }
  };

  const onChangeDebounced = useDebounce(_onChangeDebounced, 2000);

  return (
    <List searchBarPlaceholder="30 min quick meeting" isLoading={loading} onSearchTextChange={onChangeDebounced}>
      {list.length === 0 ? (
        <List.EmptyView
          icon={Icon.Calendar}
          description={loading ? `Thinking...` : `“Some copy about the links creation ”`}
          title="Ask Reclaim to create a link"
        />
      ) : (
        list.map((item) => (
          <List.Item
            key={item.uuid}
            title={item.title}
            icon={Icon.Calendar}
            actions={
              <ActionPanel>
                <Action
                  title={item.title}
                  onAction={() => {
                    // push();
                  }}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
