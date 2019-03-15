'use strict';

const express = require('express');
const Router = express.Router();
const { exec, execSync } = require('child_process');
const fs = require('fs');
const copy = require('recursive-copy');
const del = require('del');
const path = require('path');
const stripAnsi = require('strip-ansi');

const LOG_DEST = path.resolve("./docker-eosio-cdt/log.txt");
const DEL_TARGETS = ["./docker-eosio-cdt/contracts/**", "!./docker-eosio-cdt/contracts"];
const DEST = path.resolve("./docker-eosio-cdt/contracts");
const CWD = path.resolve('./docker-eosio-cdt')
const COMPILE_SCRIPT = './quick_start.sh';
const SHUTDOWN_CMD = './remove_eosio_cdt_docker.sh';

const fetchDeployableFilesFromDirectory = (directory) => {
    let response = {
        wasmPath: "",
        abiPath: "",
        errors: "",
    }
    const directoryContents = fs.readdirSync(directory);
    const wasmFileName = directoryContents.find(filePath => filePath.match(/.*\.(wasm)$/gi));
    const abiFileName = directoryContents.find(filePath => filePath.match(/.*\.(abi)$/gi));
    
    if (!wasmFileName) 
        response["errors"] += ` Cannot find a ".wasm file" in ${directory} `;
    else 
        response["wasmPath"] = path.join(directory, wasmFileName);

    if (!abiFileName) 
        response["errors"] += ` Cannot find a ".abi file" in ${directory} `; 
    else   
        response["abiPath"] = path.join(directory, abiFileName);

    return response;
}

const parseLog = (logContent) => {
    let strippedContent = stripAnsi(logContent);

    return strippedContent;
}

/**
 * How to test:
 * localhost:8081/api/eosio/compile?source=<absolute_file_path>
 * 1. This will change to POST
 */
Router.get("/compile", async (req, res) => {
    const { params, query, body } = req;
    const deletedFiles = await del(DEL_TARGETS);
    let results = await copy(query["source"], DEST);
    exec(COMPILE_SCRIPT, {
        cwd: CWD
    }, (err, stdout, stderr) => {
        execSync(SHUTDOWN_CMD, {
            cwd: CWD
        })
        let parsedLog = parseLog(fs.readFileSync(LOG_DEST, 'utf-8'));
        if (err) {
            console.log(`${stderr}`)
            console.error(`exec error: ${err}`);
            res.send({
                error: err,
                logContents: parsedLog
            });
        } else {
            const COMPILED_CONTRACTS = path.resolve(
                "./docker-eosio-cdt/compiled_contracts/" + 
                path.basename(query["source"])
            );
            const { wasmPath, abiPath, errors } = fetchDeployableFilesFromDirectory(COMPILED_CONTRACTS);
            if (errors.length > 0) {
                res.send({
                    errors: errors,
                    logContent: parsedLog
                })
            } else {
                console.log(`stdout: ${stdout}`);
                res.send({
                    wasmLocation: wasmPath,
                    abi: abiPath,
                    logContent: parsedLog
                });
            }
        }
    });
});

module.exports = Router;
