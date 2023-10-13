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
exports.deletePostController = exports.updatePostController = exports.getPostsController = exports.createPostController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const postService_1 = require("../services/postService");
const constants_1 = require("../configs/constants");
function createPostController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { postTitle } = req.body;
            const token = req.cookies['loginCookie'];
            const decodedToken = jsonwebtoken_1.default.verify(token, constants_1.JWT_SIGN);
            const userId = decodedToken.userId;
            console.log(postTitle, userId);
            const post = yield (0, postService_1.createPostService)(postTitle, userId);
            res.status(201).json({
                message: 'Posted successfully',
                data: post,
            });
        }
        catch (error) {
            console.log("error createPost controller");
            res.status(500).json({ message: 'Error creating post' });
        }
    });
}
exports.createPostController = createPostController;
function getPostsController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.cookies['loginCookie'];
            const decodedToken = jsonwebtoken_1.default.verify(token, constants_1.JWT_SIGN);
            const roles = decodedToken.role;
            if (roles == 'user') {
                try {
                    const username = decodedToken.username;
                    const post = yield (0, postService_1.getUserPostListService)(username);
                    res.status(200).json({
                        message: 'Posts retrieved successfully',
                        data: post,
                    });
                }
                catch (error) {
                    res.status(500).json({ message: 'Error retrieving post lists!' });
                }
            }
            else if (roles == 'admin') {
                try {
                    const post = yield (0, postService_1.getPostsService)();
                    res.status(200).json({
                        message: 'Posts retrieved successfully',
                        data: post,
                    });
                }
                catch (error) {
                    console.log("error createPost controller");
                    res.status(500).json({ message: 'Error retrieving posts' });
                }
            }
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
}
exports.getPostsController = getPostsController;
function updatePostController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { postTitle, postId } = req.body;
            const token = req.cookies['loginCookie'];
            const decodedToken = jsonwebtoken_1.default.verify(token, constants_1.JWT_SIGN);
            const userId = decodedToken.userId;
            // Retrieve post information, including the user ID of the post maker
            const userIdRetrieved = yield (0, postService_1.getUserIdByPostIdService)(postId);
            if (!userIdRetrieved) {
                return res.status(404).json({ message: 'Post not found' });
            }
            // Check if the user is authorized to edit the post
            if (userIdRetrieved !== userId) {
                return res.status(403).json({ message: 'You are not authorized to edit this post' });
            }
            const post = yield (0, postService_1.updatePostService)(postTitle, userId, postId);
            res.status(200).json({
                message: 'Post updated successfully',
                data: post,
            });
        }
        catch (error) {
            console.log("error updatePost controller");
            res.status(500).json({ message: 'Error updating post' });
        }
    });
}
exports.updatePostController = updatePostController;
function deletePostController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { postId } = req.body;
        try {
            const token = req.cookies['loginCookie'];
            const decodedToken = jsonwebtoken_1.default.verify(token, constants_1.JWT_SIGN);
            const userId = decodedToken.userId;
            // Get the user ID associated with the post
            const postUserId = yield (0, postService_1.getUserIdByPostIdService)(postId);
            if (postUserId === null) {
                return res.status(404).json({ message: 'Post not found' });
            }
            // Check if the user is authorized to delete the post
            if (postUserId !== userId) {
                return res.status(403).json({ message: 'You are not authorized to delete this post' });
            }
            // Delete the post if authorized
            const deletedPost = yield (0, postService_1.deletePostService)(postId);
            res.status(201).json({
                message: 'Post deleted successfully',
                data: deletedPost,
            });
        }
        catch (error) {
            console.log("error deletePost controller");
            res.status(500).json({ message: 'Error deleting post' });
        }
    });
}
exports.deletePostController = deletePostController;
