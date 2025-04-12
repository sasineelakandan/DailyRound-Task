"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    displayName: {
        type: String,
        required: false
    },
    photoURL: {
        type: String,
        required: false
    },
    createdAt: { type: Date, default: Date.now }
});
const user = mongoose_1.default.model('Users', userSchema);
exports.default = user;
//# sourceMappingURL=userModel.js.map