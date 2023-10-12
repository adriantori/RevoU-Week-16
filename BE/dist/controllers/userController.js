"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUserController = exports.loginUserController = exports.registerUserController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("cookie"));
const constants_1 = require("../configs/constants");
const userService_1 = require("../services/userService");
function registerUserController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, username, password } = req.body;
        try {
            const user = yield (0, userService_1.registerUserService)(email, username, password);
            if (user) {
                res.status(201).json({
                    message: 'Register success',
                    data: user,
                });
            }
            else {
                res.status(409).json({
                    message: 'username already exist',
                    data: user,
                });
            }
        }
        catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    });
}
exports.registerUserController = registerUserController;
function loginUserController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        console.log(username, password);
        try {
            const user = yield (0, userService_1.loginUserService)(username, password);
            console.log(user);
            if (user) {
                const token = jsonwebtoken_1.default.sign({ userId: user.user_id, username: user.user_name, role: user.role.role_name }, constants_1.JWT_SIGN);
                res.cookie('loginCookie', cookie_1.default.serialize('token', token, {
                    httpOnly: true,
                    maxAge: 60,
                    path: '/', // Optional: specify the cookie path
                }));
                res.cookie('loginCookieRefresh', cookie_1.default.serialize('token', token, {
                    httpOnly: true,
                    maxAge: 600,
                    path: '/', // Optional: specify the cookie path
                }));
                res.status(201).json({
                    message: 'Login success',
                    data: user, token
                });
            }
            else {
                res.status(401).json({
                    message: 'Login data incorrect',
                    data: user
                });
            }
        }
        catch (error) {
            console.log("error login controller");
            res.status(500).json({ message: 'Error login user' });
        }
    });
}
exports.loginUserController = loginUserController;
function logoutUserController(req, res) {
    // Set the token cookie's expiration to a past date to remove it
    res.cookie('loginCookie', '', { expires: new Date(0) });
    res.cookie('loginCookieRefresh', '', { expires: new Date(0) });
    res.status(200).json({ message: 'Logout successful' });
}
exports.logoutUserController = logoutUserController;
