import { useSelector } from "react-redux";
import { getUserById } from "./userSlice";

const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const PostAuthor = ({ post }) => {
  const author = useSelector((state) =>
    getUserById(state, Number(post.userId))
  );

  const name = author ? author.name : "Unknown";

  return (
    <span className="post-meta-item">
      <span className="author-avatar">{getInitials(name)}</span>
      <span style={{ color: "var(--text-secondary)" }}>{name}</span>
    </span>
  );
};

export default PostAuthor;