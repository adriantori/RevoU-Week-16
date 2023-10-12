"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MYSQL_URI = exports.PORT = exports.JWT_SIGN = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.JWT_SIGN = process.env.JWT_SIGN;
exports.PORT = process.env.PORT;
exports.MYSQL_URI = process.env.MYSQL_URI;
