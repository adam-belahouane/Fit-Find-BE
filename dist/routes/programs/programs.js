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
const mongoose_1 = __importDefault(require("mongoose"));
const JWTAuthMiddleware_1 = require("../../middlewares/JWTAuthMiddleware");
const professionalUser_1 = require("../../model/professionalUser");
const programs_1 = require("../../model/programs");
const users_1 = require("../../model/users");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const programsRouter = express_1.default.Router();
programsRouter.post("/payForProgram", JWTAuthMiddleware_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield stripe.checkout.sessions.create({
            line_items: [{
                    price_data: {
                        currency: 'GBP',
                        product_data: {
                            name: req.body.title
                        },
                        unit_amount: req.body.price,
                    },
                    quantity: 1,
                }],
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: process.env.FE_URL + "confirmed/" + req.body.id,
            cancel_url: process.env.FE_URL + "cancel"
        });
        res.json({ url: session.url });
    }
    catch (error) {
        console.log(error);
    }
}));
programsRouter.post("/addToUser/:productId", JWTAuthMiddleware_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUser = yield users_1.UserModel.findById(req.user.id);
        getUser === null || getUser === void 0 ? void 0 : getUser.programs.push(new mongoose_1.default.Types.ObjectId(req.params.productId));
        yield (getUser === null || getUser === void 0 ? void 0 : getUser.save());
        res.status(201).send(getUser);
    }
    catch (error) {
        console.log(error);
    }
}));
programsRouter.post("/newProgram", JWTAuthMiddleware_1.JWTAuthMiddlewarePro, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newProgram = new programs_1.ProgramModel(Object.assign(Object.assign({}, req.body), { prouser: req.user._id }));
        if (newProgram) {
            yield newProgram.save();
            const getProUser = yield professionalUser_1.ProUserModel.findById(req.user._id);
            getProUser === null || getProUser === void 0 ? void 0 : getProUser.programs.push(newProgram._id);
            yield (getProUser === null || getProUser === void 0 ? void 0 : getProUser.save());
            res.status(201).send({ success: true, data: newProgram });
        }
        else {
            res.status(400).send({
                success: false,
                message: "Something Went Wrong in the creation of the program",
            });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
exports.default = programsRouter;
//# sourceMappingURL=programs.js.map