import mongoose, { Document, model, Model, Schema } from "mongoose";
import { IPost } from "../interfaces/IPost";

const PostSchema = new Schema<IPost>(
  {
    img_url: { type: String },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default PostSchema