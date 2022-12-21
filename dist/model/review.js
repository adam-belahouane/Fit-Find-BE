"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ReviewSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    maintext: { type: String, required: true },
    ratingNum: { type: Number, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }
}, {
    timestamps: true,
});
exports.default = ReviewSchema;
//# sourceMappingURL=review.js.map