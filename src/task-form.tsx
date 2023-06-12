import { Detail, Form } from "@raycast/api";

export const TaskForm = ({ event, time }: { event?: string; time?: string }) => {
  return (
    <>
      <Detail markdown={"### test"} />
      <Form>
        <Form.Description text="Test!" />
        <Form.TextField id="1" title="Title" />
        <Form.Separator />
        <Form.TextField id="2" title="Time needed" />
        <Form.TextField id="3" title="Duration min" />
        <Form.TextField id="4" title="Duration max" />
        <Form.TextField id="5" title="Hours" />
        <Form.TextField id="6" title="Starting" />
      </Form>
    </>
  );
};
