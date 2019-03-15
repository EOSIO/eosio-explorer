"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const serviceLogic = require('./service-logic');

const PORT = 8081;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/api/eosio/", serviceLogic);

app.on('error', (err) => {
    console.log('exec error: ', err);
});

app.listen(PORT, () => {
    console.log(process.cwd())
    console.log(
        `Booted up local service server. Listening on ${PORT}`
    );
});
