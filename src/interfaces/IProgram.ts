import { Types } from "mongoose";

export interface IProgram {
    _id: Types.ObjectId
    title: String
    description: String
    paidcontent: String
    prouser: Types.ObjectId
    price: number
}