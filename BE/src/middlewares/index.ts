import { Express } from 'express';
import helmet from './helmet';
import logToMongo from './logToMongo';

export default (app: Express) => {
  helmet(app);
  logToMongo(app);
};
