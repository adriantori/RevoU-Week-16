"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordUser = exports.loginUser = exports.registerUser = void 0;
const sequelize_1 = require("sequelize");
const roleModel_1 = __importDefault(require("../models/roleModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
function registerUser(email, username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.create({
                user_email: email,
                user_name: username,
                user_pass: password,
                role_id: 2
            });
            return user;
        }
        catch (error) {
            throw new Error(error.message.replace('Validation error: ', ''));
        }
    });
}
exports.registerUser = registerUser;
function loginUser(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findOne({
                where: {
                    user_name: username
                },
                include: {
                    model: roleModel_1.default,
                    attributes: ['role_name'],
                    where: {
                        role_id: sequelize_1.Sequelize.col('User.role_id')
                    },
                    as: 'role',
                    required: true // Inner join
                },
                attributes: ['user_id', 'user_name', 'user_pass']
            });
            return user;
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
}
exports.loginUser = loginUser;
function updatePasswordUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.update({
                user_pass: password
            }, {
                where: {
                    user_email: email
                }
            });
            return user;
        }
        catch (error) {
            throw new Error(error.message.replace('Validation error: ', ''));
        }
    });
}
exports.updatePasswordUser = updatePasswordUser;
