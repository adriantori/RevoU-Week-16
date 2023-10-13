import { registerUser as registerUserDao, loginUser as loginUserDao, updatePasswordUser as updatePasswordUserDao } from "../dao/userDao";
import bcrypt from 'bcrypt';

async function registerUserService(email: string, username: string, password: string) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await registerUserDao(email, username, hashedPassword);
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

async function updatePasswordUserService(email: string, password: string) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await updatePasswordUserDao(email, hashedPassword);

        if (user && user.user_pass) {
            // Compare the provided password with the hashed password
            const isPasswordCorrect = await bcrypt.compare(password, user.user_pass);

            if (isPasswordCorrect) {
                return user;  // Password is correct, return the user
            }
        }

        return null;  // User not found or incorrect password
    } catch (error: any) {
        console.log('Error updating password:', error.message);
        throw new Error('An error occurred while updating the password');
    }
}


export { registerUserService, loginUserService, updatePasswordUserService }