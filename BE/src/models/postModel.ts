import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../middlewares/database';
import User from './userModel'; // Adjust the path to match your file structure

class Post extends Model {
    public post_id!: number;
    public post_title!: string;
    public user_id!: number;
    user: any;
}

Post.init(
    {
        post_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        post_title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'user_id',
            },
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: 'Post',
        tableName: 'posts',
        timestamps: false
    }
);

// Add the association to Post
Post.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default Post;
