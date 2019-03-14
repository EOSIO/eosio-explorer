'use strict';

const express = require('express');
const Router = express.Router();
const { exec } = require('child_process');
const fs = require('fs');
const copy = require('recursive-copy');
const del = require('del');
const path = require('path');
const stripAnsi = require('strip-ansi');

const LOG_DEST = path.resolve("./docker-eosio-cdt/log.txt");
const DEL_TARGETS = ["./docker-eosio-cdt/contracts/**", "!./docker-eosio-cdt/contracts"];
const DEST = path.resolve("./docker-eosio-cdt/contracts");

const fetchDeployableFilesFromDirectory = (directory) => {
    const directoryContents = fs.readdirSync(directory);
    const wasmFileName = directoryContents.find(filePath => filePath.match(/.*\.(wasm)$/gi));
    const abiFileName = directoryContents.find(filePath => filePath.match(/.*\.(abi)$/gi));
    if (!wasmFileName) throw new Error(`Cannot find a ".wasm file" in ${directory}`)
    if (!abiFileName) throw new Error(`Cannot find an ".abi file" in ${directory}`)
    return {
      wasmPath: path.join(directory, wasmFileName),
      abiPath: path.join(directory, abiFileName)
    }
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
    const COMPILED_CONTRACTS = path.resolve(
        "./docker-eosio-cdt/compiled_contracts/" + 
        path.basename(query["source"])
    );
    let results = await copy(query["source"], DEST);
    console.log('Files and folders that were deleted: \n', deletedFiles.join('\n'));
    console.log(`${results.length} files copied to ${DEST}`);
    results.forEach((file) => console.log(file["src"]));
    /**
     * TODO: Execute compilation script
     * 1. child_process exec shell scripts...
     * 2. Wait for execution to finish 
     * 3. Likely need to wrap next section of code
     */
    let parsedLog = parseLog(fs.readFileSync(LOG_DEST, 'utf-8'));
    /**
     * TODO: Complete log handling
     * 1. Convert CRLF breaks in logContent to proper HTML readable text
     * 2. Frontend needs to use file API to open wasm location
     * 3. Frontend can use abi property directly
     */
    try {
        const { wasmPath, abiPath } = fetchDeployableFilesFromDirectory(COMPILED_CONTRACTS);
        const abi = JSON.parse(fs.readFileSync(abiPath));
        res.json({
            wasmLocation: wasmPath,
            abi: abi,
            logContent: parsedLog
        });
    } catch (ex) {
        console.log(ex);
        res.json({
            exception: ex,
            logContent: parsedLog
        })
    }
});

module.exports = Router;
