import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { JWT_SIGN } from '../configs/constants';

import { loginUserService, registerUserService } from '../services/userService';

async function registerUserController(req: Request, res: Response) {
    const { email, username, password } = req.body;

    try {

        const user = await registerUserService(email, username, password);

        if (user) {
            res.status(201).json({
                message: 'Register success',
                data: user,
            });
        } else {
            res.status(409).json({
                message: 'username already exist',
                data: user,
            });
        }

    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function loginUserController(req: Request, res: Response) {
    const { username, password } = req.body;
    console.log(username, password);
    try {
        const user = await loginUserService(username, password);
        console.log(user);
        if (user) {
            const token = jwt.sign({ userId: user.user_id, username: user.user_name, role: user.role.role_name }, JWT_SIGN!);

            res.cookie('loginCookie', cookie.serialize('token', token, {
                httpOnly: true,
                maxAge: 60, // 1 minute in seconds
                path: '/', // Optional: specify the cookie path
            }));

            res.cookie('loginCookieRefresh', cookie.serialize('token', token, {
                httpOnly: true,
                maxAge: 600, // 1 minute in seconds
                path: '/', // Optional: specify the cookie path
            }));

            res.status(201).json({
                message: 'Login success',
                data: user, token
            })
        } else {
            res.status(401).json({
                message: 'Login data incorrect',
                data: user
            });
        }

    } catch (error) {
        console.log("error login controller");
        res.status(500).json({ message: 'Error login user' });
    }
}

function logoutUserController(req: Request, res: Response) {
    // Set the token cookie's expiration to a past date to remove it
    res.cookie('loginCookie', '', { expires: new Date(0) });
    res.cookie('loginCookieRefresh', '', { expires: new Date(0) });
    res.status(200).json({ message: 'Logout successful' });
}

export { registerUserController, loginUserController, logoutUserController }