import { Types } from "mongoose";
import { IPost } from "./IPost";
import { IReview } from "./IReview";

export default interface IUserPro {
    _id: Types.ObjectId;
    firstName: string
    lastname: string
    avatar: string
    address: string
    lat: number
    lng: number
    email: string;
    password: string;
    role: string;
    refreshToken: string;
    bio: string
    jobrole: string
    headercolor: string;
    post: IPost
    overallreview: number
    reviews: [IReview]
    programs: [Types.ObjectId]
}

