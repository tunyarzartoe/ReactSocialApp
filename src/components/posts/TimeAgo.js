import { parseISO, formatDistanceToNow } from "date-fns";

const TimeAgo = ({ date }) => {
  if (!date) return null;
  const postDate = parseISO(date);
  const timePeriod = formatDistanceToNow(postDate);

  return (
    <span className="post-meta-item">
      <i className="bi bi-clock" />
      {timePeriod} ago
    </span>
  );
};

export default TimeAgo;
