import { Action, ActionPanel, Icon, List, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import { useDebounce } from "./hooks/useDebounce";
import useInterpreter from "./hooks/useInterpreter";
import { Plan, TaskPlanDetails } from "./types/plan";
import { ListType } from "./ask-anything";
import TaskForm from "./task-form";

const FilteredAnything = ({ type, query }: { type: ListType["type"]; query: string }) => {
  const { push } = useNavigation();

  const [list, setList] = useState<{ title: string; id: string }[]>([]);
  const [plans, setPlans] = useState<Plan<TaskPlanDetails>[]>([]);
  const [search, setSearch] = useState<string>(query);
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const _onChangeDebounced = async (text: string) => {
    setDebouncedSearch(text);
  };

  const onChangeDebounced = useDebounce(_onChangeDebounced, 3000);

  const { sendToInterpreter } = useInterpreter();

  const handleAddTask = async (plan: Plan<TaskPlanDetails>) => {
    plan &&
      push(
        <TaskForm
          title={plan.planDetails.title}
          interpreter={{
            due: new Date(plan.planDetails.due),
            snoozeUntil: new Date(plan.planDetails.snoozeUntil),
            durationTimeChunk: plan.planDetails.durationTimeChunks,
          }}
        />
      );
  };

  const handleSelection = async (id: string) => {
    if (!plans) return;

    if (type === "task") {
      handleAddTask(plans.find((plan) => plan.id === id) as Plan<TaskPlanDetails>);
    }
  };

  const fetchAnything = async () => {
    setLoading(true);
    const responses = await sendToInterpreter(type, search);
    if (!responses) return;
    const { interpretedPlans } = responses as unknown as { interpretedPlans: Plan<TaskPlanDetails>[] };
    setPlans(interpretedPlans);
    const _list = interpretedPlans.map((plan) => ({ title: plan.planDetails.title, id: plan.id }));
    setList(_list);

    setLoading(false);
  };

  useEffect(() => {
    void fetchAnything();
  }, [debouncedSearch]);

  return (
    <List
      isLoading={loading}
      searchBarPlaceholder="Ask anything..."
      onSearchTextChange={(text) => {
        setSearch(text);
        onChangeDebounced(text);
      }}
      searchText={search}
    >
      {list.length === 0 ? (
        <List.EmptyView icon={Icon.LightBulb} title={`Ask Reclaim to do anything related to ${type}.`} />
      ) : (
        list.map((item) => (
          <List.Item
            key={item.id}
            title={item.title}
            icon={Icon.LightBulb}
            actions={
              <ActionPanel>
                <Action
                  title={item.id}
                  onAction={() => {
                    handleSelection(item.id);
                  }}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
};

export { FilteredAnything };
