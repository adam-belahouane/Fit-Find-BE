import mongoose, { Document, model, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import PostSchema from "./posts";
import IUserPro from "../interfaces/IUserPro";
import ReviewSchema from "./review";

interface UserProModel extends Model<IUserPro> {
  checkCredentials(
    email: string,
    password: string
  ): Promise<(IUserPro & Document) | null>;
}

const UserProSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastname: { type: String, required: true },
    overallreview: { type: Number, required: true, default: 0 },
    reviews: { default: [], type: [ReviewSchema] },
    avatar: { type: String },
    address: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["pro", "admin"] },
    refreshToken: { type: String },
    bio: { type: String },
    jobrole: { type: String },
    posts: { default: [], type: [PostSchema] },
    programs: [{ type: Schema.Types.ObjectId, ref: "Programs" }],
  },
  {
    timestamps: true,
  }
);

UserProSchema.pre("save", async function (next) {
  const newUser = this;

  const password = newUser.password;

  if (newUser.isModified("password")) {
    const hash = await bcrypt.hash(password, 10);

    newUser.password = hash;
  }
  next();
});

UserProSchema.methods.toJSON = function () {
  const userDocument = this;

  const user = userDocument.toObject();

  delete user.password;

  delete user.__v;

  return user;
};

UserProSchema.statics.checkCredentials = async function (
  email: string,
  password: string
) {
  const user = await this.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const ProUserModel = model<IUserPro, UserProModel>(
  "UserPro",
  UserProSchema
);
