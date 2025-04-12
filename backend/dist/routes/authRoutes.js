"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const authRoutes = (0, express_1.Router)();
authRoutes.post('/user-login', authController_1.login);
authRoutes.post('/verify-jwt', authController_1.verfiyJwt);
authRoutes.post('/logout-user', authController_1.logoutUser);
exports.default = authRoutes;
//# sourceMappingURL=authRoutes.js.map