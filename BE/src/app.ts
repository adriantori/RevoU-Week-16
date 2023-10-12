import express, { Request, Response, NextFunction } from 'express';
import globalMiddleware from './middlewares'

import { PORT } from './configs/constants';
import { userRoute } from './routes/userRoute';

const app = express();

globalMiddleware(app);

app.use(userRoute);

app.get('/', (req, res) => {
    const tokenCookie = req.cookies['loginCookie'];
    const tokenCookieRefresh = req.cookies['loginCookieRefresh'];

    res.status(200).json({
        message:`Token Cookie: ${tokenCookie} | Token Refresh: ${tokenCookieRefresh}`
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

export default app;