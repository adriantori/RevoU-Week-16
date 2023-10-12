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
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../configs/constants");
const auth = (allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        try {
            if (!authHeader) {
                res.status(401).json({
                    message: 'Unauthorized',
                    error: 'No authentication header provided'
                });
                return;
            }
            const token = authHeader.split(' ')[1];
            const decodedToken = jsonwebtoken_1.default.verify(token, constants_1.JWT_SIGN);
            const userRole = decodedToken.role;
            if (allowedRoles.includes(userRole)) {
                res.locals.userId = decodedToken.userId;
                res.locals.username = decodedToken.username;
                next();
            }
            else {
                res.status(403).json({
                    message: 'Forbidden',
                    error: 'User does not have the required role'
                });
            }
        }
        catch (error) {
            res.status(400).json({
                message: 'Bad Request',
                error: error.message
            });
        }
    });
};
exports.auth = auth;
