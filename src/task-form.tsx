import { Action, ActionPanel, Form, Toast, popToRoot, showToast } from "@raycast/api";
import { useState } from "react";
import { useTask } from "./hooks/useTask";
import { TIME_BLOCK_IN_MINUTES, formatDuration, formatStrDuration, parseDurationToMinutes } from "./utils/dates";

interface FormValues {
  title: string;
  timeNeeded: string;
  durationMin: string;
  durationMax: string;
  snoozeUntil: Date;
  due: Date;
  notes: string;
}

export default () => {
  const { createTask } = useTask();
  const [timeNeeded, setTimeNeeded] = useState("");
  const [timeNeededError, setTimeNeededError] = useState<string | undefined>();
  const [durationMin, setDurationMin] = useState("");
  const [durationMinError, setDurationMinError] = useState<string | undefined>();
  const [durationMax, setDurationMax] = useState("");
  const [durationMaxError, setDurationMaxError] = useState<string | undefined>();

  const handleSubmit = async (formValues: FormValues) => {
    await showToast(Toast.Style.Animated, "Creating task...");
    const { timeNeeded, durationMin, durationMax, snoozeUntil, due, notes, title } = formValues;

    const _timeNeeded = parseDurationToMinutes(timeNeeded) / TIME_BLOCK_IN_MINUTES;
    const _durationMin = parseDurationToMinutes(durationMin) / TIME_BLOCK_IN_MINUTES;
    const _durationMax = parseDurationToMinutes(durationMax) / TIME_BLOCK_IN_MINUTES;

    const created = await createTask({
      title,
      timeNeeded: _timeNeeded,
      durationMin: _durationMin,
      durationMax: _durationMax,
      snoozeUntil,
      due,
      notes,
    });

    console.log("### =>", created);

    if (created) {
      await showToast(Toast.Style.Success, "Task created", `Task ${title} created successfully`);
      await popToRoot();
    } else {
      await showToast(Toast.Style.Failure, "Something went wrong", `Task ${title} not created`);
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" title="Title" />
      <Form.Separator />
      <Form.TextField
        id="timeNeeded"
        error={timeNeededError}
        value={timeNeeded}
        onChange={(value) => {
          setTimeNeeded(value);
          if (Number(parseDurationToMinutes(formatDuration(value))) % TIME_BLOCK_IN_MINUTES !== 0) {
            setTimeNeededError("Must be an interval of 15 minutes. (15/30/45/60...)");
          } else {
            setTimeNeededError(undefined);
          }
        }}
        onBlur={(e) => {
          setTimeNeeded(formatDuration(e.target.value));
        }}
        title="Time needed"
      />
      <Form.TextField
        id="durationMin"
        title="Duration min"
        value={durationMin}
        error={durationMinError}
        onChange={(value) => {
          setDurationMin(value);
          if (Number(parseDurationToMinutes(formatDuration(value))) % TIME_BLOCK_IN_MINUTES !== 0) {
            setDurationMinError("Time must be in a interval of 15 minutes. (15/30/45/60...)");
          } else {
            setDurationMinError(undefined);
          }
        }}
        onBlur={(e) => {
          setDurationMin(formatDuration(e.target.value));
        }}
      />
      <Form.TextField
        id="durationMax"
        title="Duration max"
        value={durationMax}
        error={durationMaxError}
        onChange={(value) => {
          setDurationMax(value);
          if (Number(parseDurationToMinutes(formatDuration(value))) % TIME_BLOCK_IN_MINUTES !== 0) {
            setDurationMaxError("Time must be in a interval of 15 minutes. (15/30/45/60...)");
          } else {
            setDurationMaxError(undefined);
          }
        }}
        onBlur={(e) => {
          setDurationMax(formatDuration(e.target.value));
        }}
      />
      <Form.DatePicker type={Form.DatePicker.Type.DateTime} id="snoozeUntil" title="Starting" />
      <Form.DatePicker type={Form.DatePicker.Type.DateTime} id="due" title="Due" />
      <Form.TextArea id="notes" title="Notes" />
    </Form>
  );
};
