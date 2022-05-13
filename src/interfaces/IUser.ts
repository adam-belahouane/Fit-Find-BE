import { Types } from "mongoose";


export default interface IUser {
    _id: Types.ObjectId;
    firstName: string
    lastname: string
    city: string
    email: string;
    password: string;
    avatar: string;
    role: string;
    refreshToken: string;
    programs: [Types.ObjectId]
}