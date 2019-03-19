'use strict';

const express = require('express');
const Router = express.Router();
const { exec, execSync } = require('child_process');
const fs = require('fs');
const copy = require('recursive-copy');
const del = require('del');
const path = require('path');
const stripAnsi = require('strip-ansi');
const fileManip = require('file');

const LOG_DEST = path.resolve("./docker-eosio-cdt/log.txt");
const DEL_TARGETS = ["./docker-eosio-cdt/contracts/**", "!./docker-eosio-cdt/contracts"];
const DEST = path.resolve("./docker-eosio-cdt/contracts");
const CWD = path.resolve('./docker-eosio-cdt')
const SHUTDOWN_CMD = './remove_eosio_cdt_docker.sh';

const getStringDiff = (sourcePath, path) => path.split(sourcePath).join('').substring(1);

const fetchDeployableFilesFromDirectory = (directory) => {
    let response = {
        wasmPath: "",
        abiPath: "",
        errors: [],
    }

    const directoryContents = fs.readdirSync(directory);

    const wasmFileName = directoryContents.find(filePath => filePath.match(/.*\.(wasm)$/gi));
    const abiFileName = directoryContents.find(filePath => filePath.match(/.*\.(abi)$/gi));

    response["wasmPath"] = (!wasmFileName) ? "" : path.join(directory, wasmFileName);
    response["abiPath"] = (!abiFileName) ? "" : path.join(directory, abiFileName);

    if (!wasmFileName) 
        response["errors"].push(`Cannot find '.wasm' file in ${directory}`);

    if (!abiFileName)
        response["errors"].push(`Cannot find '.abi' file in ${directory}`);

    return response;
}

const filterHeaderFiles = (fileName) => (fileName.includes('.hpp') || fileName.includes('.cpp'));

const parseDirectoriesToInclude = (sourcePath) => {
    let directories = [];
    let i = 0;
    fileManip.walkSync(sourcePath, (ds, dirPath, dirs, files) => {
        const sourceFiles = (dirs) ? dirs.filter(filterHeaderFiles) : [];
        if (sourceFiles.length > 0) {
            let fileDiff = getStringDiff(sourcePath, ds);
            if (fileDiff[0] == '/') fileDiff = fileDiff.substring(1);
            directories.push(
                "/opt/eosio/bin/contracts/"+fileDiff
            );
        }
    });
    return directories;
}

const parseLog = (logContent) => {
    let strippedContent = stripAnsi(logContent);

    return strippedContent;
}

/**
 * How to test:
 * localhost:8081/api/eosio/compile
 * POST request
 * 1. <source> - Absolute source file
 */
Router.post("/compile", async (req, res) => {
    const { body } = req;

    try {
        const deletedFiles = await del(DEL_TARGETS);
        let results = null;
        let actualEntryFile = null;
        let compileTarget = null;
        let COMPILE_SCRIPT = "";

        if (fs.lstatSync(body["source"]).isDirectory()) {
            const directories = parseDirectoriesToInclude(body["source"]);
            results = await copy(body["source"], DEST);
            actualEntryFile = body["entryFile"];
            compileTarget = getStringDiff(body["source"], actualEntryFile);
            COMPILE_SCRIPT = "./quick_start.sh "+compileTarget+" "+directories.join(' ');
            console.log(COMPILE_SCRIPT);
        } else {
            results = await copy(body["source"], DEST+"/"+path.basename(body["source"]));
            actualEntryFile = body["source"]; 
            compileTarget = path.basename(body["source"]);
            COMPILE_SCRIPT = "./quick_start.sh "+compileTarget;
        }

        console.log("Deleted files:\n", deletedFiles.join('\n'));
        results.forEach((file) => console.log("Copied file: ", file["src"]));
        console.log("Target entry file: ", compileTarget);

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
                    path.basename(actualEntryFile, '.cpp')
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

    } catch (ex) {
        console.log(ex);
        res.send({
            exception: ex
        })
    }
});

module.exports = Router;
