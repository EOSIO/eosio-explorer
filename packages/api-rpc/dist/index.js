"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var get_info_1 = __importDefault(require("./api/get_info"));
var create_account_1 = __importDefault(require("./api/create_account"));
exports.default = {
    get_info: get_info_1.default,
    create_account: create_account_1.default
};
