import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../middlewares/database';

class Role extends Model {
    public role_id!: number;
    public role_name!: "admin" | "user";
}

Role.init(
    {
        role_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        role_name: {
            type: DataTypes.ENUM("admin", "user"),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'roles',
        timestamps: false
    }
);
export default Role; // Export the Role model


