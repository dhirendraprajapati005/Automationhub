import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
