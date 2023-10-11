import { Express, Request } from "express";
const mongooseMorgan = require('mongoose-morgan');

export default async(app: Express) => {
  app.use(mongooseMorgan({
    connectionString: 'mongodb+srv://adriantori:adri123@cluster0.3u5txct.mongodb.net/RevoU_w15?retryWrites=true&w=majority',
  }));
}
