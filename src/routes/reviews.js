"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWTAuthMiddleware_1 = require("../middlewares/JWTAuthMiddleware");
const professionalUser_1 = require("../model/professionalUser");
const mongoose_1 = __importDefault(require("mongoose"));
const reviewsRouter = express_1.default.Router();
reviewsRouter.post("/newReview/:proUserId", JWTAuthMiddleware_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newReview = yield professionalUser_1.ProUserModel.findByIdAndUpdate(req.params.proUserId, { $push: { reviews: Object.assign(Object.assign({}, req.body), { user: req.user._id }) } }, { new: true });
        if (newReview) {
            const userGettingReview = yield professionalUser_1.ProUserModel.findById(req.params.proUserId);
            const reviewNums = userGettingReview === null || userGettingReview === void 0 ? void 0 : userGettingReview.reviews.map((num) => num.ratingNum);
            const reducer = (preValue, currentValue) => preValue + currentValue;
            const allReviewNums = reviewNums === null || reviewNums === void 0 ? void 0 : reviewNums.reduce(reducer);
            const reviewNumsLength = reviewNums === null || reviewNums === void 0 ? void 0 : reviewNums.length;
            userGettingReview.overallreview = allReviewNums / reviewNumsLength;
            userGettingReview === null || userGettingReview === void 0 ? void 0 : userGettingReview.save();
            res.status(201).send({ success: true, data: newReview });
        }
        else {
            res.status(400).send({ success: false, error: "Bad Request" });
        }
    }
    catch (error) {
        next(error);
    }
}));
reviewsRouter.put("/newReview/:proUserId/:postId", JWTAuthMiddleware_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateReview = yield professionalUser_1.ProUserModel.updateOne({
            _id: req.params.proUserId,
            "reviews._id": new mongoose_1.default.Types.ObjectId(req.params.postId)
        }, {
            $set: { "reviews.$.review": req.body }
        }, { new: true });
        if (updateReview) {
            const userGettingReview = yield professionalUser_1.ProUserModel.findById(req.params.proUserId);
            const reviewNums = userGettingReview === null || userGettingReview === void 0 ? void 0 : userGettingReview.reviews.map((num) => num.ratingNum);
            const reducer = (preValue, currentValue) => preValue + currentValue;
            const allReviewNums = reviewNums === null || reviewNums === void 0 ? void 0 : reviewNums.reduce(reducer);
            const reviewNumsLength = reviewNums === null || reviewNums === void 0 ? void 0 : reviewNums.length;
            userGettingReview.overallreview = allReviewNums / reviewNumsLength;
            userGettingReview === null || userGettingReview === void 0 ? void 0 : userGettingReview.save();
            res.status(201).send({ success: true, data: updateReview });
        }
        else {
            res.status(400).send({ success: false, error: "Bad Request" });
        }
    }
    catch (error) {
        next(error);
    }
}));
reviewsRouter.delete("/newReview/:proUserId/:postId", JWTAuthMiddleware_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteReview = yield professionalUser_1.ProUserModel.findByIdAndUpdate(req.params.proUserId, { $pull: { reviews: { _id: req.params.postId } } }, { new: true });
        if (deleteReview) {
            const userGettingReview = yield professionalUser_1.ProUserModel.findById(req.params.proUserId);
            const reviewNums = userGettingReview === null || userGettingReview === void 0 ? void 0 : userGettingReview.reviews.map((num) => num.ratingNum);
            const reducer = (preValue, currentValue) => preValue + currentValue;
            const allReviewNums = reviewNums === null || reviewNums === void 0 ? void 0 : reviewNums.reduce(reducer);
            const reviewNumsLength = reviewNums === null || reviewNums === void 0 ? void 0 : reviewNums.length;
            userGettingReview.overallreview = allReviewNums / reviewNumsLength;
            userGettingReview === null || userGettingReview === void 0 ? void 0 : userGettingReview.save();
            res.status(201).send({ success: true, message: "Comment is deleted" });
        }
        else {
            res.status(400).send({ success: false, error: "Bad Request" });
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = reviewsRouter;
