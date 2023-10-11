import express, { Request, Response, NextFunction } from 'express';
import globalMiddleware from './middlewares'

import { PORT } from './configs/constants';
import { userRoute } from './routes/userRoute';

const app = express();

globalMiddleware(app);

app.use(userRoute);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const port = PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});

export default app;