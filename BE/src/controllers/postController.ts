import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { createPostService, deletePostService, getPostsService, getUserIdByPostIdService, getUserPostListService, updatePostService } from '../services/postService';
import { JWT_SIGN } from '../configs/constants';

async function createPostController(req: Request, res: Response) {
    try {
        const { postTitle } = req.body;
        const token = req.cookies['loginCookie']
        const decodedToken: jwt.JwtPayload = jwt.verify(token, JWT_SIGN!) as jwt.JwtPayload;

        const userId = decodedToken.userId
        console.log(postTitle, userId);

        const post = await createPostService(postTitle, userId);
        res.status(201).json({
            message: 'Posted successfully',
            data: post,
        });
    } catch (error) {
        console.log("error createPost controller");
        res.status(500).json({ message: 'Error creating post' });
    }
}

async function getPostsController(req: Request, res: Response) {
    try {
        const token = req.cookies['loginCookie'];
        const decodedToken: jwt.JwtPayload = jwt.verify(token, JWT_SIGN!) as jwt.JwtPayload;

        const roles = decodedToken.role

        if (roles == 'user') {
            try {
                const username = decodedToken.username;

                const post = await getUserPostListService(username);
                res.status(200).json({
                    message: 'Posts retrieved successfully',
                    data: post,
                });

            } catch (error) {
                res.status(500).json({ message: 'Error retrieving post lists!' });
            }
        } else if (roles == 'admin') {
            try {
                const post = await getPostsService();
                res.status(200).json({
                    message: 'Posts retrieved successfully',
                    data: post,
                });
            } catch (error) {
                console.log("error createPost controller");
                res.status(500).json({ message: 'Error retrieving posts' });
            }
        }
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }

}

async function updatePostController(req: Request, res: Response) {
    try {
        const { postTitle, postId } = req.body;

        const token = req.cookies['loginCookie'];
        const decodedToken: jwt.JwtPayload = jwt.verify(token, JWT_SIGN!) as jwt.JwtPayload;

        const userId = decodedToken.userId

        // Retrieve post information, including the user ID of the post maker
        const userIdRetrieved: number = await getUserIdByPostIdService(postId);

        if (!userIdRetrieved) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user is authorized to edit the post
        if (userIdRetrieved !== userId) {
            return res.status(403).json({ message: 'You are not authorized to edit this post' });
        }

        const post = await updatePostService(postTitle, userId, postId);
        res.status(200).json({
            message: 'Post updated successfully',
            data: post,
        });
    } catch (error) {
        console.log("error updatePost controller");
        res.status(500).json({ message: 'Error updating post' });
    }
}

async function deletePostController(req: Request, res: Response) {
    const { postId } = req.body;

    try {
        const token = req.cookies['loginCookie'];
        const decodedToken: jwt.JwtPayload = jwt.verify(token, JWT_SIGN!) as jwt.JwtPayload;

        const userId = decodedToken.userId;

        // Get the user ID associated with the post
        const postUserId = await getUserIdByPostIdService(postId);

        if (postUserId === null) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user is authorized to delete the post
        if (postUserId !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }

        // Delete the post if authorized
        const deletedPost = await deletePostService(postId);
        res.status(201).json({
            message: 'Post deleted successfully',
            data: deletedPost,
        });
    } catch (error) {
        console.log("error deletePost controller");
        res.status(500).json({ message: 'Error deleting post' });
    }
}


export { createPostController, getPostsController, updatePostController, deletePostController }