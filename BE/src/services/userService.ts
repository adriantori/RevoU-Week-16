import { registerUser as registerUserDao, loginUser as loginUserDao } from "../dao/userDao";
import bcrypt from 'bcrypt';

async function registerUserService(username: string, password: string) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await registerUserDao(username, hashedPassword);
        return user;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

async function loginUserService(username: string, password: string) {
    try {
        const user = await loginUserDao(username);
        if(user){
            const isPasswordCorrect = await bcrypt.compare(password, user.user_pass);
            if(isPasswordCorrect){
                return user
            }
        }
        return null
    } catch (error: any) {
        console.log('error login service: ', error.message)
        throw new Error(error.message);
    }
}

export { registerUserService, loginUserService }