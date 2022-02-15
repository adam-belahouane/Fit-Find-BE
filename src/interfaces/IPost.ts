import { Types } from "mongoose";

export interface IPost {
    _id: Types.ObjectId
    img_url: String
    text: String

}