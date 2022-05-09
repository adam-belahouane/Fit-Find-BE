import { UserModel } from "../model/users";
import { ProUserModel } from "../model/professionalUser";

import { verifyJWT } from "../auth/tools";
import { RequestHandler } from "express";

export const JWTAuthMiddleware: RequestHandler = async (req, res, next) => {
  if (!req.cookies.accessToken) {
    res.status(401).send({
      success: false,
      message: "Please provide token in Authorization header!",
    });
  } else {
    try {
      const token = req.cookies.accessToken

      const decodedToken = await verifyJWT(token);

      const user = await UserModel.findById(decodedToken._id);

      if (user) {
        req.user = user;

        next();
      } else {
        res.status(404).send({ success: false, message: "User not found" });
      }
    } catch (error) {
      res.status(401).send({ success: false, message: "Not authorized" });
    }
  }
};

export const JWTAuthMiddlewarePro: RequestHandler = async (req, res, next) => {
  if (!req.cookies.accessToken) {
    res.status(401).send({
      success: false,
      message: "Please provide token in Authorization header!",
    });
  } else {
    try {
      const token = req.cookies.accessToken

      const decodedToken = await verifyJWT(token);

      const user = await ProUserModel.findById(decodedToken._id);

      if (user) {
        req.user = user;

        next();
      } else {
        res.status(404).send({ success: false, message: "User not found" });
      }
    } catch (error) {
      res.status(401).send({ success: false, message: "Not authorized" });
    }
  }
};

