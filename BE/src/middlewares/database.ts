import { createPool, Pool, PoolConnection } from 'mysql2/promise';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

interface CustomRequest extends Request {
    pool: PoolConnection;
}

// Construct the database URI
const dbUri = process.env.MYSQL_URI ||'mysql://root:@127.0.0.1:3306/mydatabase';

// Create a connection pool using the URI
const pool: Pool = createPool({
    uri: dbUri,
});

// Create Sequelize instance using the URI
const sequelize = new Sequelize(dbUri, {
    dialect: 'mysql',
    logQueryParameters: true,
});

// Middleware function to attach the database connection pool to the request object
const attachDB = (req: CustomRequest, res: Response, next: NextFunction): void => {
    pool.getConnection().then((connection) => {
        req.pool = connection;
        next();
    }).catch((err) => {
        console.log(dbUri);
        console.error('Error getting database connection:', err);
        res.status(500).json({ message: 'Database error' });
    });
};

export { attachDB, sequelize };
