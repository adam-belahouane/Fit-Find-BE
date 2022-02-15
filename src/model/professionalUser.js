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
exports.ProUserModel = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const posts_1 = __importDefault(require("./posts"));
const review_1 = __importDefault(require("./review"));
const UserProSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastname: { type: String, required: true },
    overallreview: { type: Number, required: true, default: 0 },
    reviews: { default: [], type: [review_1.default] },
    avatar: { type: String },
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["pro", "admin"] },
    refreshToken: { type: String },
    bio: { type: String },
    jobrole: { type: String },
    posts: { default: [], type: [posts_1.default] },
    programs: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Programs" }],
}, {
    timestamps: true,
});
UserProSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const newUser = this;
        const password = newUser.password;
        if (newUser.isModified("password")) {
            const hash = yield bcrypt_1.default.hash(password, 10);
            newUser.password = hash;
        }
        next();
    });
});
UserProSchema.methods.toJSON = function () {
    const userDocument = this;
    const user = userDocument.toObject();
    delete user.password;
    delete user.__v;
    return user;
};
UserProSchema.statics.checkCredentials = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email });
        if (user) {
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (isMatch) {
                return user;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    });
};
exports.ProUserModel = (0, mongoose_1.model)("UserPro", UserProSchema);
