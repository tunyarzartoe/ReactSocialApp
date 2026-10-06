import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReaction, getUserReactions } from "./postSlice";

const reactionEmoji = {
  thumbsUp: { emoji: "👍", label: "Like" },
  heart: { emoji: "❤️", label: "Love" },
  rocket: { emoji: "🚀", label: "Rocket" },
  fire: { emoji: "🔥", label: "Fire" },
  coffee: { emoji: "☕", label: "Coffee" },
  wow: { emoji: "😮", label: "Wow" },
};

const ReactionButtons = ({ post }) => {
  const dispatch = useDispatch();
  const userReactions = useSelector(getUserReactions);
  const postUserReactions = userReactions[post.id] || {};

  const handleReactionClick = (name) => {
    dispatch(toggleReaction({ postId: post.id, reaction: name }));
  };

  return (
    <div className="reactions-bar">
      {Object.entries(reactionEmoji).map(([name, { emoji, label }]) => {
        const count = post.reactions?.[name] || 0;
        const isActive = !!postUserReactions[name];

        return (
          <button
            key={name}
            type="button"
            className={`reaction-btn ${isActive ? "active" : ""}`}
            onClick={() => handleReactionClick(name)}
            title={`${label} (${count})`}
            aria-label={`${label} (${count})`}
          >
            <span className="reaction-emoji">{emoji}</span>
            <span className="reaction-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ReactionButtons;