import { Sequelize } from "sequelize";
import Role from "../models/roleModel";
import User from "../models/userModel";

async function registerUser(email: string, username: string, password: string): Promise<any> {
    try {
        const user = await User.create({
            user_email: email,
            user_name: username,
            user_pass: password,
            role_id: 2
        });

        return user;
    } catch (error: any) {
        throw new Error(error.message.replace('Validation error: ', ''));
    }
}

async function loginUser (username: string): Promise<any> {
    try {
        const user = await User.findOne({
            where: {
                user_name: username
            },
            include: {
                model: Role,
                attributes: ['role_name'],
                where: {
                    role_id: Sequelize.col('User.role_id')
                },
                as: 'role',
                required: true // Inner join
            },
            attributes: ['user_id', 'user_name','user_pass']
        });
        return user;
    } catch (error: any) {
        throw new Error(error.message);
    }
}


async function updatePasswordUser(email: string, password: string): Promise<any> {
    try {
        const user = await User.update({
            user_pass: password
        },{
            where:{
                user_email: email
            }
        });

        return user;
    } catch (error: any) {
        throw new Error(error.message.replace('Validation error: ', ''));
    }
}

export { registerUser, loginUser, updatePasswordUser }