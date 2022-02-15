import { Types } from "mongoose";

export interface IReview {
    _id: Types.ObjectId
    title: String
    maintext: String
    ratingNum: Number
    user: Types.ObjectId

}

