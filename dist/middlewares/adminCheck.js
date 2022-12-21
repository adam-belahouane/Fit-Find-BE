"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCheckMiddleware = void 0;
const AdminCheckMiddleware = (req, res, next) => {
    if (req.user.role === "admin") {
        next();
    }
    else {
        res.status(401).send({ success: false, message: "You are not authorized" });
    }
};
exports.AdminCheckMiddleware = AdminCheckMiddleware;
//# sourceMappingURL=adminCheck.js.map