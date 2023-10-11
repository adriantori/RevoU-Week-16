import * as bodyParser from 'body-parser';
import { Express } from 'express';

export default (app: Express) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }))
}