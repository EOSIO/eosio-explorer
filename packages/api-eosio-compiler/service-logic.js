'use strict';

const express = require('express');
const Router = express.Router();
const { exec } = require('child_process');
const fs = require('fs');

Router.get("/compile", (req, res) => {
    console.log(req);
        
    res.json("OK!");
});

module.exports = Router;
