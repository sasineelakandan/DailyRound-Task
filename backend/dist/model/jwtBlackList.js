"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tokenBlackList = new mongoose_1.default.Schema({
    blackListedToken: {
        type: String
    },
});
const tokenBlackListModel = mongoose_1.default.model('tokenBlackList', tokenBlackList);
exports.default = tokenBlackListModel;
//# sourceMappingURL=jwtBlackList.js.map