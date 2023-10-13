"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 30 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: 'Too many requests from this IP, please try again later.'
});
exports.default = loginLimiter;
