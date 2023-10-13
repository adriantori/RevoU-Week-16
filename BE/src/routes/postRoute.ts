import { Router } from "express";
import cors from 'cors';
import whitelist from "../middlewares/whitelist";

export const postRoute = Router();

postRoute.get('/testPost', (req, res) => {
    const tokenCookie = req.cookies['loginCookie'];
    const tokenCookieRefresh = req.cookies['loginCookieRefresh'];

    res.status(200).json({
        message:`Token Cookie: ${tokenCookie} | Token Refresh: ${tokenCookieRefresh}`
    });
});