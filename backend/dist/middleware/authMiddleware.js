"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).send('you are not authenticated');
        }
        jsonwebtoken_1.default.verify(token, process.env.JWT_KEY, async (err, payload) => {
            if (err)
                return res.status(403).send('Token is not valid');
            req.userId = payload.userId;
            next();
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=authMiddleware.js.map