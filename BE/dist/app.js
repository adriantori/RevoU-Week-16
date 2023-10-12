"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = __importDefault(require("./middlewares"));
const constants_1 = require("./configs/constants");
const userRoute_1 = require("./routes/userRoute");
const app = (0, express_1.default)();
(0, middlewares_1.default)(app);
app.use(userRoute_1.userRoute);
app.get('/', (req, res) => {
    const tokenCookie = req.cookies['loginCookie'];
    const tokenCookieRefresh = req.cookies['loginCookieRefresh'];
    res.status(200).json({
        message: `Token Cookie: ${tokenCookie} | Token Refresh: ${tokenCookieRefresh}`
    });
});
app.listen(constants_1.PORT, () => {
    console.log(`Server is running on port ${constants_1.PORT}`);
});
exports.default = app;
