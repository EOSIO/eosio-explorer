"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var get_accounts_1 = __importDefault(require("./get_accounts"));
var get_block_latest_1 = __importDefault(require("./get_block_latest"));
var get_blocks_1 = __importDefault(require("./get_blocks"));
var get_block_1 = __importDefault(require("./get_block"));
var get_transactions_1 = __importDefault(require("./get_transactions"));
var get_actions_1 = __importDefault(require("./get_actions"));
var get_all_permissions_1 = __importDefault(require("./get_all_permissions"));
exports.default = {
    get_accounts: get_accounts_1.default,
    get_block_latest: get_block_latest_1.default,
    get_blocks: get_blocks_1.default,
    get_block: get_block_1.default,
    get_transactions: get_transactions_1.default,
    get_actions: get_actions_1.default,
    get_all_permissions: get_all_permissions_1.default
};
