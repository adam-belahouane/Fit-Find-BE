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
exports.verifyRefreshTokenPro = exports.verifyRefreshToken = exports.verifyRefreshJWT = exports.verifyJWT = exports.JWTAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = require("../model/users");
const professionalUser_1 = require("../model/professionalUser");
const JWTAuth = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield generateJWTToken({ _id: user._id });
    const refreshToken = yield generateRefreshJWTToken({ _id: user._id });
    user.refreshToken = refreshToken;
    yield user.save();
    return { accessToken, refreshToken };
});
exports.JWTAuth = JWTAuth;
const generateJWTToken = (payload) => new Promise((resolve, reject) => jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "10 mins" }, (err, token) => {
    if (err)
        reject(err);
    else
        resolve(token);
}));
const verifyJWT = (token) => new Promise((resolve, reject) => jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err)
        reject(err);
    else
        resolve(decodedToken);
}));
exports.verifyJWT = verifyJWT;
const generateRefreshJWTToken = (payload) => new Promise((resolve, reject) => jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "1 week" }, (err, token) => {
    if (err)
        reject(err);
    else
        resolve(token);
}));
const verifyRefreshJWT = (token) => new Promise((resolve, reject) => jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET, (err, decodedToken) => {
    if (err)
        reject(err);
    else
        resolve(decodedToken);
}));
exports.verifyRefreshJWT = verifyRefreshJWT;
const verifyRefreshToken = (currentRefreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedRefreshToken = yield (0, exports.verifyRefreshJWT)(currentRefreshToken);
    const user = yield users_1.UserModel.findById(decodedRefreshToken._id);
    if (!user)
        throw new Error("User not found!");
    if (user.refreshToken && user.refreshToken === currentRefreshToken) {
        const { accessToken, refreshToken } = yield (0, exports.JWTAuth)(user);
        return { accessToken, refreshToken };
    }
    else {
        throw new Error("Token not valid!");
    }
});
exports.verifyRefreshToken = verifyRefreshToken;
const verifyRefreshTokenPro = (currentRefreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedRefreshToken = yield (0, exports.verifyRefreshJWT)(currentRefreshToken);
    const user = yield professionalUser_1.ProUserModel.findById(decodedRefreshToken._id);
    if (!user)
        throw new Error("ProUser not found!");
    if (user.refreshToken && user.refreshToken === currentRefreshToken) {
        const { accessToken, refreshToken } = yield (0, exports.JWTAuth)(user);
        return { accessToken, refreshToken };
    }
    else {
        throw new Error("Token not valid!");
    }
});
exports.verifyRefreshTokenPro = verifyRefreshTokenPro;
//# sourceMappingURL=tools.js.map