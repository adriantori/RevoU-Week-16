import { Router } from "express";
import { loginUserController, registerUserController } from "../controllers/userController";

export const userRoute = Router();

userRoute.post('/register', registerUserController);
userRoute.post('/login', loginUserController);