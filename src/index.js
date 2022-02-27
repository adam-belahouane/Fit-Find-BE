"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 3001;
mongoose_1.default.connect(process.env.MONGO_URL)
    .then(() => {
    console.log(`Connected to Mongo`);
    server_1.server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => console.log(error));
