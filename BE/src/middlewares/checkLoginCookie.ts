import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SIGN } from '../configs/constants';

export default function checkLoginCookie(req: Request, res: Response, next: NextFunction) {
    const loginCookie = req.cookies['loginCookie'];
    const loginCookieRefresh = req.cookies['loginCookieRefresh'];

    if (!loginCookie && loginCookieRefresh) {
        try {
            const decodedPayload: jwt.JwtPayload = jwt.decode(loginCookieRefresh) as jwt.JwtPayload
            // Generate a new token and set it in the loginCookie
            const newToken = jwt.sign(decodedPayload, JWT_SIGN!);

            res.cookie('loginCookie', newToken, {
                httpOnly: true,
                maxAge: 1000 * 60, // 1 minute
                path: '/', // Optional: specify the cookie path
            });

            // Send the new token in the response
            res.status(201).json({
                message: 'Current session refreshed'
            })
            return;
        } catch (error: any) {
            res.status(400).json({
                message: error.message,
            })
            return;
        }
    } else if (loginCookie) {
        next();
        return;
    } else {
        res.status(403).json({
            message: "Please logged in before accessing this API"
        })
        return;
    }
}