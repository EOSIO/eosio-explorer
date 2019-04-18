"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const serviceLogic = require('./service-logic');

const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const envConfig = fs.existsSync('.env.local') && dotenv.parse(fs.readFileSync('.env.local'));

if (envConfig){
  for (let k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const PORT = process.env.LOCAL_SERVICE_PORT;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/api/eosio/", cors(), serviceLogic);

app.on('error', (err) => {
  console.log('exec error: ', err);
});

app.listen(PORT, () => {
  console.log(process.cwd())
  console.log(
    `Booted up local service server. Listening on ${PORT}`
  );
});

process.on('uncaughtException', function(err) {
  console.log("UNCAUGHT EXCEPTION");
  console.log("[Inside 'uncaughtException' event] " + err.stack || err.message );
});
