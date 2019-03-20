'use strict';

const express = require('express');
const Router = express.Router();
const { exec, execSync } = require('child_process');
const fs = require('fs');
const copy = require('recursive-copy');
const del = require('del');
const path = require('path');
const Helper = require('./helpers');

const LOG_DEST = path.resolve("./docker-eosio-cdt/stdout.txt");
const ERR_DEST = path.resolve("./docker-eosio-cdt/stderr.txt");
const DEL_TARGETS = ["./docker-eosio-cdt/contracts/**", "!./docker-eosio-cdt/contracts"];
const DEST = path.resolve("./docker-eosio-cdt/contracts");
const CWD = path.resolve('./docker-eosio-cdt')
const SHUTDOWN_CMD = './remove_eosio_cdt_docker.sh';

/**
 * How to test:
 * localhost:8081/api/eosio/compile
 * POST request
 * 1. <source> - Absolute source file path
 */
Router.post("/compile", async (req, res) => {
    const { body } = req;

    try {
        const deletedFiles = await del(DEL_TARGETS);
        let results = null;
        let compileTarget = path.basename(body["source"]);
        let COMPILE_SCRIPT = "";

        const directories = Helper.parseDirectoriesToInclude(path.dirname(body["source"]));
        results = await copy(path.dirname(body["source"]), DEST);
        COMPILE_SCRIPT = "./quick_start.sh "+compileTarget+" "+directories.join(' ');

        console.log("Deleted files:\n", deletedFiles.join('\n'));
        results.forEach((file) => console.log("Copied file: ", file["src"]));
        console.log("Target entry file: ", compileTarget);

        exec(COMPILE_SCRIPT, {
            cwd: CWD
        }, (err, stdout, stderr) => {
            execSync(SHUTDOWN_CMD, {
                cwd: CWD
            })
            let parsedStdOut = Helper.parseLog(fs.readFileSync(LOG_DEST, 'utf-8'));
            let parsedStdErr = Helper.parseLog(fs.readFileSync(ERR_DEST, 'utf-8'));
            if (err) {
                res.send({
                    compiled: false,
                    errors: Helper.parseLog(err.message),
                    stdout: parsedStdOut,
                    stderr: parsedStdErr
                });
            } else {
                const COMPILED_CONTRACTS = path.resolve(
                    "./docker-eosio-cdt/compiled_contracts/" + 
                    path.basename(compileTarget, '.cpp')
                );
                const { wasmPath, abiPath, programErrors } = Helper.fetchDeployableFilesFromDirectory(COMPILED_CONTRACTS);
                if (programErrors.length > 0) {
                    res.send({
                        compiled: false,
                        errors: programErrors,
                        stdout: parsedStdOut,
                        stderr: parsedStdErr
                    })
                } else {
                    console.log(`stdout: ${stdout}`);
                    res.send({
                        compiled: true,
                        wasmLocation: wasmPath,
                        abi: abiPath,
                        stdout: parsedStdOut,
                        stderr: parsedStdErr
                    });
                }
            }
        });

    } catch (ex) {
        res.send({
            exception: ex,
            errors: [
                ex.message
            ]
        })
    }
});

module.exports = Router;
