"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var AccountDetailsSchema = new mongoose_1.default.Schema({
    account: {
        type: String,
        required: true
    }
});
exports.default = mongoose_1.default.model('AccountDetails', AccountDetailsSchema, 'pub_keys');
