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
exports.roleCheck = void 0;
const users_1 = require("../model/users");
const roleCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.UserModel.findOne(req.email);
    if (user.role === "freelancer") {
        next();
    }
    else {
        res.status(401).send({ success: false, message: "You are not authorized" });
    }
});
exports.roleCheck = roleCheck;
//# sourceMappingURL=roleCheck.js.map