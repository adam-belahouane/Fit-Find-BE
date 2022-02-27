import express, { NextFunction, Router } from "express";
import { JWTAuth, verifyRefreshToken } from "../auth/tools";
import { Request, Response } from "express";
import { ProUserModel } from "../model/professionalUser";
import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
const { CloudinaryStorage } = require("multer-storage-cloudinary");
import createError from "http-errors";
import { JWTAuthMiddlewarePro } from "../middlewares/JWTAuthMiddleware";

import dotenv from "dotenv";

dotenv.config();

const{CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} = process.env 

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "FitFind-Pro-Profile-Images",
  },
});

const proUsersRouter = express.Router();

proUsersRouter.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await ProUserModel.checkCredentials(email, password);

    if (user) {
      const token = await JWTAuth(user);
      console.log(token);

      res.cookie("accessToken", token.accessToken, {
        httpOnly: true,
      });
      res.cookie("refreshToken", token.refreshToken, {
        httpOnly: true,
      });

      res.send("success");
    } else {
      res
        .status(404)
        .send({ success: false, message: "Credentials are not correct" });
    }
  } catch (error) {
    res.status(404).send({ success: false, error: error });
  }
});

proUsersRouter.route("/register").post(async (req: Request, res: Response) => {
  try {
    const createUser = new ProUserModel({ ...req.body, role: "pro" });

    if (createUser) {
      await createUser.save();

      const tokens = await JWTAuth(createUser);

      res.status(201).send({ success: true, user: createUser._id, tokens });
    } else {
      res.status(400).send({
        success: false,
        message: "Something Went Wrong in the creation of the user",
      });
    }
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
});

proUsersRouter.post("/refreshToken", async (req, res, next) => {
  try {
    if (!req.cookies.refreshToken)
      next(createError(400, "Refresh Token not provided"));
    else {
      const token = await verifyRefreshToken(req.cookies.refreshToken);
      res.cookie("accessToken", token.accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.cookie("refreshToken", token.refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.send("success");
    }
  } catch (error) {
    next(error);
  }
});

proUsersRouter.post("/logout", JWTAuthMiddlewarePro, async (req, res, next) => {
  try {
    const user = req.user;
    user.refreshToken = "";
    await user.save();
    res.cookie("accessToken", "", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.cookie("refreshToken", "", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.send("logged out!");
  } catch (error) {
    console.log("error");
    next(error);
  }
});

proUsersRouter
  .route("/me")
  .get(JWTAuthMiddlewarePro, async (req, res, next) => {
    try {
      const getUser = await ProUserModel.findById(req.user._id)
        .populate([{path: "programs",
      populate: {path: 'prouser'}}, {path: "reviews.user"}])

      res.send(getUser)
    } catch (error) {
      next(error);
    }
  })
  .put(JWTAuthMiddlewarePro, async (req, res, next) => {
    try {
      const user = await ProUserModel.findByIdAndUpdate(req.user._id, {...req.body});
      res.status(200).send({success: true, user: user})
    } catch (error) {
      next(error);
    }
  })
  .delete(JWTAuthMiddlewarePro, async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  });

proUsersRouter
  .route("/getAll")
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allProUsers = await ProUserModel.find().populate([{
        path: "reviews.user",
      },{ path: "programs"}]);

      res.send(allProUsers);
    } catch (error) {
      next(error);
    }
  });

proUsersRouter.get(
  "/getProUser/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await ProUserModel.findById(req.params.userId).populate([{
        path: "reviews.user",
      },{ path: "programs"}]);
      if (user) {
        res.send(user);
      } else {
        res.send("no user by that id");
      }
    } catch (error) {
      next(error);
    }
  }
);

proUsersRouter.post(
  "/profilePic/:userId",
  multer({ storage: cloudinaryStorage }).single("avatar"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await ProUserModel.findById(req.params.userId);
      if (user) {
        user.avatar = req.file!.path;

        await user.save();

        res.status(203).send({ success: true, data: user });
      } else {
        res
          .status(404)
          .send({ success: false, message: "Experience not found" });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default proUsersRouter;
