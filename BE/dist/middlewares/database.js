"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.attachDB = void 0;
const promise_1 = require("mysql2/promise");
const constants_1 = require("../configs/constants");
const sequelize_1 = require("sequelize");
// Construct the database URI
const dbUri = constants_1.MYSQL_URI || 'mysql://root:@127.0.0.1:3306/revou_w16';
// Create a connection pool using the URI
const pool = (0, promise_1.createPool)({
    uri: dbUri,
});
// Create Sequelize instance using the URI
const sequelize = new sequelize_1.Sequelize(dbUri, {
    dialect: 'mysql',
    logQueryParameters: true,
});
exports.sequelize = sequelize;
// Middleware function to attach the database connection pool to the request object
const attachDB = (req, res, next) => {
    pool.getConnection().then((connection) => {
        req.pool = connection;
        next();
    }).catch((err) => {
        console.log(dbUri);
        console.error('Error getting database connection:', err);
        res.status(500).json({ message: 'Database error' });
    });
};
exports.attachDB = attachDB;
