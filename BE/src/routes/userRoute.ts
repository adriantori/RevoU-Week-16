import { Router } from "express";
import cors from 'cors';
import { loginUserController, registerUserController } from "../controllers/userController";
import whitelist from "../middlewares/whitelist";

export const userRoute = Router();

userRoute.options('/register', cors(whitelist.clientOptionsGlobal));
userRoute.options('/login', cors(whitelist.clientOptionsGlobal));
userRoute.post('/register', cors(whitelist.clientOptionsGlobal), registerUserController);
userRoute.post('/login', cors(whitelist.clientOptionsGlobal), loginUserController);