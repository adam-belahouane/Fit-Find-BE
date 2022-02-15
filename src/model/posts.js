"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    img_url: { type: String },
    text: { type: String, required: true },
}, {
    timestamps: true,
});
exports.default = PostSchema;
