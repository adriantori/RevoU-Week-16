"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoute = void 0;
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
exports.postRoute = (0, express_1.Router)();
exports.postRoute.get('/testPost', (req, res) => {
    const tokenCookie = req.cookies['loginCookie'];
    const tokenCookieRefresh = req.cookies['loginCookieRefresh'];
    res.status(200).json({
        message: `Token Cookie: ${tokenCookie} | Token Refresh: ${tokenCookieRefresh}`
    });
});
exports.postRoute.post('/create', postController_1.createPostController);
exports.postRoute.get('/retrieve', postController_1.getPostsController);
exports.postRoute.patch('/update', postController_1.updatePostController);
exports.postRoute.delete('/delete', postController_1.deletePostController);
