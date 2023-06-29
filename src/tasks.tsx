import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { useTask } from "./hooks/useTask";
import { Task } from "./types/task";
import { isWithinInterval } from "date-fns";

const TaskItem = ({ task }: { task: Task }) => {
  const isHappening = isWithinInterval(new Date(), {
    end: new Date(task.due),
    start: new Date(task.snoozeUntil),
  });

  return (
    <List.Item
      key={task.title}
      title={task.title}
      actions={
        <ActionPanel>
          {isHappening ? <Action title="Snooze" icon={Icon.Stop} /> : <Action title="Start" icon={Icon.Play} />}
        </ActionPanel>
      }
    />
  );
};

export default function Command() {
  const [list, setList] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchTasks } = useTask();

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      const tasks = await fetchTasks();
      setList((tasks as Task[]) || []);
      setIsLoading(false);
    };
    void loadTasks();
  }, []);

  return (
    <List isLoading={isLoading} filtering>
      {list.map((item) => (
        <TaskItem key={item.id} task={item} />
      ))}
    </List>
  );
}
