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
const users_1 = require("../model/users");
const tools_1 = require("../auth/tools");
const JWTAuthMiddleware_1 = require("../middlewares/JWTAuthMiddleware");
const http_errors_1 = __importDefault(require("http-errors"));
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
dotenv_1.default.config();
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
cloudinary_1.v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "FitFind-Profile-Images",
    },
});
const usersRouter = express_1.default.Router();
usersRouter.route("/login").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield users_1.UserModel.checkCredentials(email, password);
        if (user) {
            const token = yield (0, tools_1.JWTAuth)(user);
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
        }
        else {
            res
                .status(404)
                .send({ success: false, message: "Credentials are not correct" });
        }
    }
    catch (error) {
        res.status(404).send({ success: false, error: error });
    }
}));
usersRouter.route("/register").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createUser = new users_1.UserModel(Object.assign(Object.assign({}, req.body), { role: "normal" }));
        if (createUser) {
            yield createUser.save();
            const tokens = yield (0, tools_1.JWTAuth)(createUser);
            res.status(201).send({ success: true, user: createUser._id, tokens });
        }
        else {
            res.status(400).send({
                success: false,
                message: "Something Went Wrong in the creation of the user",
            });
        }
    }
    catch (error) {
        if (error.code == 11000)
            res.status(409).send({ success: false, error: "user with this email already exist " });
        res.status(400).send({ success: false, error: error });
    }
}));
usersRouter.post("/refreshToken", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.cookies.refreshToken)
            next((0, http_errors_1.default)(400, "Refresh Token not provided"));
        else {
            const token = yield (0, tools_1.verifyRefreshToken)(req.cookies.refreshToken);
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
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.post("/logout", JWTAuthMiddleware_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        user.refreshToken = "";
        yield user.save();
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
    }
    catch (error) {
        console.log("error");
        next(error);
    }
}));
usersRouter
    .route("/me")
    .get(JWTAuthMiddleware_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUser = yield users_1.UserModel.findById(req.user._id)
            .populate({ path: "programs",
            populate: { path: 'prouser' } });
        res.send(getUser);
    }
    catch (error) {
        next(error);
    }
}))
    .put(JWTAuthMiddleware_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.UserModel.findByIdAndUpdate(req.user._id, Object.assign({}, req.body));
        res.status(200).send({ success: true, user: user });
    }
    catch (error) {
        next(error);
    }
}))
    .delete(JWTAuthMiddleware_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.post("/profilePic/me", JWTAuthMiddleware_1.JWTAuthMiddleware, (0, multer_1.default)({ storage: cloudinaryStorage }).single("avatar"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.UserModel.findById(req.user._id);
        if (user) {
            user.avatar = req.file.path;
            yield user.save();
            res.status(203).send({ success: true, data: user });
        }
        else {
            res
                .status(404)
                .send({ success: false, message: "Experience not found" });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
usersRouter.put("/headercolor", JWTAuthMiddleware_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.UserModel.findById(req.user._id);
        if (user) {
            user.headercolor = req.body.color;
            yield user.save();
            res.status(203).send({ success: true, data: user });
        }
        else {
            res.status(404).send({ success: false, message: "User not found" });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
exports.default = usersRouter;
//# sourceMappingURL=users.js.map