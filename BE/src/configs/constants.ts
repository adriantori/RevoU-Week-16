import dotenv from "dotenv";
dotenv.config();

export const JWT_SIGN = process.env.JWT_SIGN;
export const PORT = process.env.PORT;