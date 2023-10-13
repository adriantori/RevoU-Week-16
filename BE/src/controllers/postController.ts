import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { createPostService, deletePostService, getPostsService, getUserPostListService, updatePostService } from '../services/postService';
import { JWT_SIGN } from '../configs/constants';

async function createPostController(req: Request, res: Response) {
    const { postTitle } = req.body;

    try {
        const userId = res.locals.userId

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
                const username = decodedToken.user_name;

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
    const { postTitle, postId } = req.body;

    try {
        const userId = res.locals.userId

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
    console.log(postId);
    try {
        const post = await deletePostService(postId);
        res.status(201).json({
            message: 'Post deleted successfully',
            data: post,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post' });
    }
}

export { createPostController, getPostsController, updatePostController, deletePostController }