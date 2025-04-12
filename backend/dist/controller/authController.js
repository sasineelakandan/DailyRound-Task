"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.verfiyJwt = exports.login = void 0;
const jwtBlackList_1 = __importDefault(require("../model/jwtBlackList"));
const userModel_1 = __importDefault(require("../model/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
    return jsonwebtoken_1.default.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};
const login = async (req, res) => {
    try {
        const { email, displayName, photoURL } = req.body;
        if (!email) {
            return res.status(400).send('Email is required');
        }
        const userDetails = await userModel_1.default.findOneAndUpdate({ email }, {
            email,
            displayName,
            photoURL,
            createdAt: new Date(),
        }, {
            new: true,
            upsert: true,
        });
        const token = createToken(email, userDetails.id);
        res.cookie('jwt', token, {
            httpOnly: false,
            maxAge,
            sameSite: 'none',
            secure: true,
            path: '/',
        });
        return res.status(200).json(userDetails);
    }
    catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error');
    }
};
exports.login = login;
const verfiyJwt = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        console.log(req.cookies);
        if (!token) {
            return res.status(401).send('you are not authenticated');
        }
        const isBlackListed = await jwtBlackList_1.default.findOne({ blackListedToken: token });
        if (isBlackListed) {
            return res.status(403).send('Token is not valid');
        }
        jsonwebtoken_1.default.verify(token, process.env.JWT_KEY, async (err, payload) => {
            if (err)
                return res.status(403).send('Token is not valid');
            res.json({ success: true });
        });
    }
    catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error');
    }
};
exports.verfiyJwt = verfiyJwt;
const logoutUser = async (req, res) => {
    try {
        console.log(req.cookies.jwt);
        const blackListedToken = req.cookies.jwt;
        await jwtBlackList_1.default.create({ blackListedToken });
        res.status(200).send('jwt blacklisted');
    }
    catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error');
    }
};
exports.logoutUser = logoutUser;
//# sourceMappingURL=authController.js.map