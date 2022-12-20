import express from "express";
import { JWTAuthMiddleware } from "../middlewares/JWTAuthMiddleware";
import { ProUserModel } from "../model/professionalUser";
import mongoose, { Types } from "mongoose";

const reviewsRouter = express.Router();

reviewsRouter.post(
  "/newReview/:proUserId",
  JWTAuthMiddleware,
  async (req: any, res, next) => {
    try {
      const newReview = await ProUserModel.findByIdAndUpdate(
        req.params.proUserId,
        { $push: { reviews: { ...req.body, user: req.user._id } } },
        { new: true }
      );
      if (newReview) {
        const userGettingReview = await ProUserModel.findById(
          req.params.proUserId
        );
        const reviewNums = userGettingReview?.reviews.map(
          (num) => num.ratingNum
        );
        const reducer = (preValue: any, currentValue: any) =>
          preValue + currentValue;
        const allReviewNums: any = reviewNums?.reduce(reducer);
        const reviewNumsLength: any = reviewNums?.length;
        userGettingReview!.overallreview = allReviewNums / reviewNumsLength;
        userGettingReview?.save();
        res.status(201).send({ success: true, data: newReview });
      } else {
        res.status(400).send({ success: false, error: "Bad Request" });
      }
    } catch (error) {
      next(error);
    }
  }
);

reviewsRouter.put(
  "/newReview/:proUserId/:postId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const updateReview = await ProUserModel.updateOne(
        {
          _id: req.params.proUserId,
          "reviews._id": new mongoose.Types.ObjectId(req.params.postId)
        },
        {
          $set: { "reviews.$.review" : req.body }
        },
        { new: true }
      )
      if (updateReview) {
        const userGettingReview = await ProUserModel.findById(
          req.params.proUserId
        );
        const reviewNums = userGettingReview?.reviews.map(
          (num) => num.ratingNum
        );
        const reducer = (preValue: any, currentValue: any) =>
          preValue + currentValue;
        const allReviewNums: any = reviewNums?.reduce(reducer);
        const reviewNumsLength: any = reviewNums?.length;
        userGettingReview!.overallreview = allReviewNums / reviewNumsLength;
        userGettingReview?.save();
        res.status(201).send({ success: true, data: updateReview });
      } else {
        res.status(400).send({ success: false, error: "Bad Request" });
      }
    } catch (error) {
      next(error);
    }
  }
);

reviewsRouter.delete(
  "/newReview/:proUserId/:postId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const deleteReview = await ProUserModel.findByIdAndUpdate(
        req.params.proUserId,
        { $pull: { reviews: { _id: req.params.postId} } },
        { new: true }
      );
      if (deleteReview) {
        const userGettingReview = await ProUserModel.findById(
          req.params.proUserId
        );
        const reviewNums = userGettingReview?.reviews.map(
          (num) => num.ratingNum
        );
        const reducer = (preValue: any, currentValue: any) =>
          preValue + currentValue;
        const allReviewNums: any = reviewNums?.reduce(reducer);
        const reviewNumsLength: any = reviewNums?.length;
        userGettingReview!.overallreview = allReviewNums / reviewNumsLength;
        userGettingReview?.save();
        res.status(201).send({ success: true, message: "Comment is deleted" });
      } else {
        res.status(400).send({ success: false, error: "Bad Request" });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default reviewsRouter;
