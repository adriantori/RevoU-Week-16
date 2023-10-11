import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { JWT_SIGN } from '../configs/constants';

import { loginUserService, registerUserService } from '../services/userService';

async function registerUserController(req: Request, res: Response) {
    const { username, password } = req.body;

    try {
        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long',
            });
        }

        if (!/^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
            return res.status(400).json({
                message: 'Password must contain both letters and numbers',
            });
        }

        const user = await registerUserService(username, password);

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

export { registerUserController, loginUserController }