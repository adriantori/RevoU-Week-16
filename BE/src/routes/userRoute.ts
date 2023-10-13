import { Router } from "express";
import cors from 'cors';
import { loginUserController, registerUserController, logoutUserController, generateResetUserController, resetPasswordController } from "../controllers/userController";
import whitelist from "../middlewares/whitelist";
import loginLimiter from "../middlewares/loginLimiter";

export const userRoute = Router();

userRoute.options('/register', cors(whitelist.clientOptionsGlobal));
userRoute.options('/login', cors(whitelist.clientOptionsGlobal));
userRoute.options('/logout', cors(whitelist.clientOptionsGlobal));
userRoute.options('/reset-password', cors(whitelist.clientOptionsGlobal));
userRoute.options('/confirm-reset', cors(whitelist.clientOptionsGlobal));
userRoute.post('/register', cors(whitelist.clientOptionsGlobal), registerUserController);
userRoute.post('/login', cors(whitelist.clientOptionsGlobal), loginLimiter, loginUserController);
userRoute.get('/logout', cors(whitelist.clientOptionsGlobal), logoutUserController);
userRoute.post('/reset-password', cors(whitelist.clientOptionsGlobal), generateResetUserController);
userRoute.post('/confirm-reset', cors(whitelist.clientOptionsGlobal), resetPasswordController);
