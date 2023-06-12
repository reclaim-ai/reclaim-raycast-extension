import { Action, ActionPanel, Detail, useNavigation } from "@raycast/api";
import { TaskForm } from "./task-form";

export default (props: { arguments: { event: string; time: string } }) => {
  const { event, time } = props.arguments;

  const { push } = useNavigation();

  const markdown = `#### Creating new task:
  - **Event:** ${event}
  - **Time:** ${time}

  |   |   |   |   |   |
  |---|---|---|---|---|
  |   |   |   |   |   |
  |   |   |   |   |   |
  |   |   |   |   |   |
  `;

  const handleCreateTask = () => {
    //
  };

  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action
            title="Create Task"
            onAction={() => {
              //
            }}
          />
          <Action
            title="Customize Task and Create"
            onAction={() => {
              push(<TaskForm />);
            }}
          />
        </ActionPanel>
      }
    />
  );
};
