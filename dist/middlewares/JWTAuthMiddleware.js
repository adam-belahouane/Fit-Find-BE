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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTAuthMiddlewarePro = exports.JWTAuthMiddleware = void 0;
const users_1 = require("../model/users");
const professionalUser_1 = require("../model/professionalUser");
const tools_1 = require("../auth/tools");
const JWTAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies.accessToken) {
        res.status(401).send({
            success: false,
            message: "Please provide token in Authorization header!",
        });
    }
    else {
        try {
            const token = req.cookies.accessToken;
            const decodedToken = yield (0, tools_1.verifyJWT)(token);
            const user = yield users_1.UserModel.findById(decodedToken._id);
            if (user) {
                req.user = user;
                next();
            }
            else {
                res.status(404).send({ success: false, message: "User not found" });
            }
        }
        catch (error) {
            res.status(401).send({ success: false, message: "Not authorized" });
        }
    }
});
exports.JWTAuthMiddleware = JWTAuthMiddleware;
const JWTAuthMiddlewarePro = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies.accessToken) {
        res.status(401).send({
            success: false,
            message: "Please provide token in Authorization header!",
        });
    }
    else {
        try {
            const token = req.cookies.accessToken;
            const decodedToken = yield (0, tools_1.verifyJWT)(token);
            const user = yield professionalUser_1.ProUserModel.findById(decodedToken._id);
            if (user) {
                // req.user = user;
                next();
            }
            else {
                res.status(404).send({ success: false, message: "User not found" });
            }
        }
        catch (error) {
            res.status(401).send({ success: false, message: "Not authorized" });
        }
    }
});
exports.JWTAuthMiddlewarePro = JWTAuthMiddlewarePro;
//# sourceMappingURL=JWTAuthMiddleware.js.map