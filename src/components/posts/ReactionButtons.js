import { useDispatch } from "react-redux";
import { addReaction } from "./postSlice";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionButtons = ({ post }) => {
  const dispatch = useDispatch();

  return (
    <div className="reactions-row">
      {Object.entries(reactionEmoji).map(([name, emoji]) => {
        const count = post.reactions[name];
        return (
          <button
            key={name}
            type="button"
            title={name}
            className={`reaction-btn ${count > 0 ? "reacted" : ""}`}
            onClick={() =>
              dispatch(addReaction({ postId: post.id, reaction: name }))
            }
          >
            <span>{emoji}</span>
            {count > 0 && <span style={{ fontSize: "0.75rem" }}>{count}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default ReactionButtons;