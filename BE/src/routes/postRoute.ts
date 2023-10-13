import { Router } from "express";
import { createPostController, deletePostController, getPostsController, updatePostController } from "../controllers/postController";


export const postRoute = Router();

postRoute.get('/testPost', (req, res) => {
    const tokenCookie = req.cookies['loginCookie'];
    const tokenCookieRefresh = req.cookies['loginCookieRefresh'];

    res.status(200).json({
        message:`Token Cookie: ${tokenCookie} | Token Refresh: ${tokenCookieRefresh}`
    });
});

postRoute.post('/create', createPostController);
postRoute.get('/retrieve', getPostsController);
postRoute.patch('/update', updatePostController);
postRoute.delete('/delete', deletePostController);
