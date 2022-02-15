import {Request, Response, NextFunction } from 'express';

export const AdminCheckMiddleware = (req: any, res: Response, next: NextFunction) => {
    if (req.user.role === "admin") {
        next();
    } else {
        res.status(401).send({ success: false, message: "You are not authorized" });
    }
}