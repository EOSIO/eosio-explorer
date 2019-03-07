"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var account_1 = __importDefault(require("./account"));
var dbRoute = "mongodb://localhost:27017/mongopluginmainnet";
// connects our back end code with the database
mongoose_1.default.connect(dbRoute, { useNewUrlParser: true });
var db = mongoose_1.default.connection;
db.once("open", function () { return console.log("connected to the database"); });
// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));
var promise = new Promise(function (reslove, reject) {
    account_1.default
        .find()
        .then(function (doc) {
        reslove(doc);
    })
        .catch(function (err) {
        reject(err);
    });
});
exports.getAccounts = promise;
