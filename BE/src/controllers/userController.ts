import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { JWT_SIGN } from '../configs/constants';
import { v4 as uuidv4 } from 'uuid';

import { loginUserService, registerUserService, updatePasswordUserService } from '../services/userService';

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

            res.cookie('loginCookie', token, {
                httpOnly: true,
                maxAge: 1000 * 60, // 1 minute
                path: '/', // Optional: specify the cookie path
            });

            res.cookie('loginCookieRefresh', token, {
                httpOnly: true,
                maxAge: 600000, // 10 minutes in milliseconds
                path: '/', // Optional: specify the cookie path
            });

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

const tokenCache = new Map<string, { token: string, timestamp: number }>();

function generateResetToken() {
    return uuidv4();
}

async function storeResetTokenInMemory(userEmail: string, resetToken: string) {
    // Store the reset token in memory with a timestamp
    const timestamp = Date.now();
    tokenCache.set(userEmail, { token: resetToken, timestamp: timestamp });

    // Expire the token after 5 minutes
    setTimeout(() => {
        tokenCache.delete(userEmail);
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
}

async function generateResetUserController(req: Request, res: Response) {
    try {
        const userEmail = req.body.email; // Assuming the email is submitted in the request body

        // Generate a reset token
        const resetToken = generateResetToken();

        // Store the reset token in memory and set an expiration
        await storeResetTokenInMemory(userEmail, resetToken);

        // Respond with the reset token
        res.status(200).json({
            message: 'Reset token generated successfully',
            resetToken: resetToken
        });
    } catch (error) {
        console.error('Error generating reset token:', error);
        res.status(500).json({ message: 'An error occurred while generating reset token' });
    }
}

async function retrieveResetTokenFromMemoryByToken(resetToken: string) {
    for (const [email, tokenData] of tokenCache.entries()) {
        if (tokenData.token === resetToken) {
            return email;
        }
    }
    return null;
}


async function resetPasswordController(req: Request, res: Response) {
    try {
        const resetToken = req.body.resetToken;
        const newPassword = req.body.newPassword;

        // Retrieve the user's email using the reset token
        const userEmail = await retrieveResetTokenFromMemoryByToken(resetToken);

        if (!userEmail) {
            return res.status(400).json({ message: 'Invalid reset token' });
        }

        // Update the user's password
        await updatePasswordUserService(userEmail, newPassword);

        for (const [email] of tokenCache.entries()) {
            if (email === userEmail) {
                tokenCache.delete(email);
            }
        }

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'An error occurred while resetting the password' });
    }
}


export { registerUserController, loginUserController, logoutUserController, generateResetUserController, resetPasswordController }