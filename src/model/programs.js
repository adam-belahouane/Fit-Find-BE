"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramModel = void 0;
const mongoose_1 = require("mongoose");
const ProgramsSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    paidcontent: { type: String, required: true },
    price: { type: Number, require: true },
    prouser: { type: mongoose_1.Schema.Types.ObjectId, ref: "UserPro", required: true }
}, {
    timestamps: true,
});
exports.ProgramModel = (0, mongoose_1.model)("Programs", ProgramsSchema);
