// src/models/comment.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  text: string;
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
}

const commentSchema: Schema = new Schema({
  text: { type: String, required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IComment>("Comment", commentSchema);
