import {Schema, model } from "mongoose";
import { IProgram } from "../interfaces/IProgram";

const ProgramsSchema = new Schema<IProgram>(
  {
    title: { type: String, required: true },
    description: {type: String, required: true},
    paidcontent: { type: String, required: true },
    price: { type: Number, require: true},
    prouser: { type: Schema.Types.ObjectId, ref: "UserPro", required: true}
  },
  {
    timestamps: true,
  }
);

export const ProgramModel = model<IProgram>(
    "Programs",
    ProgramsSchema
  );