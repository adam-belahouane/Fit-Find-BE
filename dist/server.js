"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./routes/users"));
const proUser_1 = __importDefault(require("./routes/proUser"));
const posts_1 = __importDefault(require("./routes/posts/posts"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const programs_1 = __importDefault(require("./routes/programs/programs"));
const server = (0, express_1.default)();
exports.server = server;
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL, "http://localhost:3000"];
console.log('whitelist:', whitelist);
const corsOptions = {
    origin: function (origin, next) {
        if (whitelist.indexOf(origin) !== -1) {
            next(null, next);
        }
        else {
            console.log("error");
        }
    },
    credentials: true
};
server.use((0, cors_1.default)(corsOptions));
server.use((0, cookie_parser_1.default)());
server.use(express_1.default.json());
// Routes
server.use("/users", users_1.default);
server.use("/proUser", proUser_1.default);
server.use("/posts", posts_1.default);
server.use("/reviews", reviews_1.default);
server.use("/program", programs_1.default);
console.table((0, express_list_endpoints_1.default)(server));
//# sourceMappingURL=server.js.map