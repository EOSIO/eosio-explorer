"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: __dirname + "/../.env" });
var mongo_1 = __importDefault(require("./config/mongo"));
mongo_1.default();
var api_1 = __importDefault(require("./api"));
exports.default = api_1.default;
