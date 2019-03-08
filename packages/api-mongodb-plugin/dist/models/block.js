"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var BlockSchema = new mongoose_1.default.Schema({
    block_num: {
        type: Number,
        required: true
    },
    block_id: {
        type: String,
        required: true
    }
});
exports.default = mongoose_1.default.model('Block', BlockSchema, 'blocks');
