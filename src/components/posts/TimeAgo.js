import React from "react";
import { parseISO, formatDistanceToNow } from "date-fns";

const TimeAgo = ({ date }) => {
  let timeAgo = "";
  if (date) {
    try {
      const parsedDate = parseISO(date);
      const timePeriod = formatDistanceToNow(parsedDate);
      timeAgo = `${timePeriod} ago`;
    } catch (e) {
      timeAgo = "recently";
    }
  }

  return (
    <span className="text-muted d-inline-flex align-items-center gap-1 small" title={date}>
      <i className="bi bi-clock" style={{ fontSize: "0.8rem" }}></i>
      <span>{timeAgo}</span>
    </span>
  );
};

export default TimeAgo;
