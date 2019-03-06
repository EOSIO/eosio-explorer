import mongoose from 'mongoose';
import AccountModel from './account';

const dbRoute = "mongodb://localhost:27017/mongopluginmainnet";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let promise = new Promise((reslove, reject)=>{

  AccountModel
    .find()
    .then(doc=>{
      reslove(doc);
    })
    .catch(err=>{
      reject(err);
    });

})

export const getAccounts = promise;
