import express from "express";
import { UserModel } from "../model/users";
import { JWTAuth, verifyRefreshToken } from "../auth/tools";
import { JWTAuthMiddleware } from "../middlewares/JWTAuthMiddleware";
import { Request, Response } from "express";
import createError from "http-errors";
const { CloudinaryStorage } = require("multer-storage-cloudinary");
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import multer from "multer";

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
    folder: "FitFind-Profile-Images",
  },
});

const usersRouter = express.Router();

usersRouter.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.checkCredentials(email, password);

    if (user) {
      const token = await JWTAuth(user);
      console.log(token);

      res.cookie("accessToken", token.accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true
      });
      res.cookie("refreshToken", token.refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true
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

usersRouter.route("/register").post(async (req: Request, res: Response) => {
  try {
    const createUser = new UserModel({ ...req.body, role: "normal" });

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

usersRouter.post("/refreshToken", async (req, res, next) => {
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

usersRouter.post("/logout", JWTAuthMiddleware, async (req, res, next) => {
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

usersRouter
  .route("/me")
  .get(JWTAuthMiddleware, async (req, res, next) => {
    try {
      const getUser = await UserModel.findById(req.user._id)
        .populate({path: "programs",
      populate: {path: 'prouser'}})

      res.send(getUser);
    } catch (error) {
      next(error);
    }
  })
  .put(JWTAuthMiddleware, async (req, res, next) => {
    try {
      const user = await UserModel.findByIdAndUpdate(req.user._id, {
        ...req.body,
      });
      res.status(200).send({ success: true, user: user });
    } catch (error) {
      next(error);
    }
  })
  .delete(JWTAuthMiddleware, async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  });

  usersRouter.post(
    "/profilePic/me",
    JWTAuthMiddleware,
    multer({ storage: cloudinaryStorage }).single("avatar"),
    async (req: Request, res: Response, next) => {
      try {
        const user = await UserModel.findById(req.user._id);
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
        console.log(error);
      }
    }
  );

export default usersRouter;
