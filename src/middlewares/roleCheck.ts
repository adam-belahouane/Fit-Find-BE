import {Request, Response, NextFunction } from 'express';
import { UserModel } from '../model/users';

export const roleCheck = async (req: any, res: Response, next: NextFunction) => {
    const user = await UserModel.findOne(req.email)
    if (user!.role === "freelancer") {
        next();
    } else {
        res.status(401).send({ success: false, message: "You are not authorized" });
    }
}