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
const JWTAuthMiddleware_1 = require("../../middlewares/JWTAuthMiddleware");
const professionalUser_1 = require("../../model/professionalUser");
const multer_1 = __importDefault(require("multer"));
// import { CloudinaryStorage } from "multer-storage-cloudinary";
const cloudinary_1 = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
cloudinary_1.v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "FitFind-Pro-Post-Images",
    },
});
const postsRouter = express_1.default.Router();
postsRouter.post("/newPosts", JWTAuthMiddleware_1.JWTAuthMiddlewarePro, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPost = yield professionalUser_1.ProUserModel.findByIdAndUpdate(req.user._id, { $push: { posts: req.body } }, { new: true });
        if (newPost) {
            res.status(201).send({ success: true, data: newPost });
        }
        else {
            res.status(400).send({ success: false, error: "Bad Request" });
        }
    }
    catch (error) {
        next(error);
    }
}));
postsRouter
    .route("/post/:postId")
    .delete(JWTAuthMiddleware_1.JWTAuthMiddlewarePro, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletePost = yield professionalUser_1.ProUserModel.findByIdAndUpdate(req.user._id, { $pull: { posts: { _id: req.params.postId } } }, { new: true });
        if (deletePost) {
            res.status(200).send({ success: true, message: "Comment is deleted" });
        }
        else {
            res.status(400).send({ success: false, error: "Bad Request" });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
postsRouter.post("/newPost/img/:postId", JWTAuthMiddleware_1.JWTAuthMiddlewarePro, (0, multer_1.default)({ storage: cloudinaryStorage }).single("post"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const post = yield professionalUser_1.ProUserModel.updateOne({
            _id: req.user._id,
            "posts._id": req.params.postId,
        }, {
            $set: { "posts.$.img_url": (_a = req.file) === null || _a === void 0 ? void 0 : _a.path },
        }, { new: true });
        if (post) {
            res.status(203).send({ success: true, data: post });
        }
        else {
            res.send("no");
        }
    }
    catch (error) {
        console.log(error);
    }
}));
exports.default = postsRouter;
//# sourceMappingURL=posts.js.map