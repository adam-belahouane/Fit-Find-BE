import mongoose, { Document, model, Model, Schema } from "mongoose";
import { IReview } from "../interfaces/IReview";


const ReviewSchema = new Schema<IReview>(
    {
      title: { type: String, required: true},
      maintext: { type: String, required: true},
      ratingNum: { type: Number, required: true},
      user: { type: Schema.Types.ObjectId, ref: "User", required: true}
    },
    {
      timestamps: true,
    }
  );
  
  export default ReviewSchema