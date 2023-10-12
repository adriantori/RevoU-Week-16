import { Express } from 'express';
import helmet from './helmet';
import logToMongo from './logToMongo';
import bodyParser from './bodyParser';

export default (app: Express) => {
  bodyParser(app);
  helmet(app);
  logToMongo(app);
};
