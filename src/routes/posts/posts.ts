import express from "express";
import { Request } from "express";
import { JWTAuthMiddlewarePro } from "../../middlewares/JWTAuthMiddleware";
import { ProUserModel } from "../../model/professionalUser";
import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "FitFind-Pro-Post-Images",
  },
});

const postsRouter = express.Router();

postsRouter.post(
  "/newPosts",
  JWTAuthMiddlewarePro,
  async (req: Request, res, next) => {
    try {
      const newPost = await ProUserModel.findByIdAndUpdate(
        req.user._id,
        { $push: { posts: req.body } },
        { new: true }
      );
      if (newPost) {
        res.status(201).send({ success: true, data: newPost });
      } else {
        res.status(400).send({ success: false, error: "Bad Request" });
      }
    } catch (error) {
      next(error);
    }
  }
);

postsRouter
  .route("/post/:postId")
  .delete(JWTAuthMiddlewarePro, async (req, res, next) => {
    try {
      const deletePost = await ProUserModel.findByIdAndUpdate(
        req.user._id,
        { $pull: { posts: { _id: req.params.postId } } },
        { new: true }
      );

      if (deletePost) {
        res.status(200).send({ success: true, message: "Comment is deleted" });
      } else {
        res.status(400).send({ success: false, error: "Bad Request" });
      }
    } catch (error) {
      console.log(error);
    }
  });

postsRouter.post(
  "/newPost/img/:postId",
  JWTAuthMiddlewarePro,
  multer({ storage: cloudinaryStorage }).single("post"),
  async (req, res, next) => {
    try {
      const post = await ProUserModel.updateOne(
        {
          _id: req.user._id,
          "posts._id": req.params.postId,
        },
        {
          $set: { "posts.$.img_url": req.file?.path },
        },
        { new: true }
      );

      if (post) {
        res.status(203).send({ success: true, data: post });
      } else {
        res.send("no");
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default postsRouter;
