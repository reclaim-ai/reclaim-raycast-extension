import { format } from "date-fns";

export const formatDisplayEventDate = ({
  start,
  end,
  hoursFormat,
}: {
  start: Date;
  end: Date;
  hoursFormat: "12h" | "24h";
}) => {
  const formatType = hoursFormat === "12h" ? "h:mm a" : "HH:mm";

  //   const dateFormat = "MMMM d, yyyy";
  const startString = format(start, formatType);
  const endString = format(end, formatType);
  //   const dateString = format(start, dateFormat);
  //   return `${startString} - ${endString} on ${dateString}`;
  return `${startString} - ${endString}`;
};
