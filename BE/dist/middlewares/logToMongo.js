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
Object.defineProperty(exports, "__esModule", { value: true });
const mongooseMorgan = require('mongoose-morgan');
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.use(mongooseMorgan({
        connectionString: 'mongodb+srv://adriantori:adri123@cluster0.3u5txct.mongodb.net/RevoU_w15?retryWrites=true&w=majority',
    }));
});
