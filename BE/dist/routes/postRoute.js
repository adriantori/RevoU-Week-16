"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoute = void 0;
const express_1 = require("express");
exports.postRoute = (0, express_1.Router)();
exports.postRoute.get('/testPost', (req, res) => {
    const tokenCookie = req.cookies['loginCookie'];
    const tokenCookieRefresh = req.cookies['loginCookieRefresh'];
    res.status(200).json({
        message: `Token Cookie: ${tokenCookie} | Token Refresh: ${tokenCookieRefresh}`
    });
});
