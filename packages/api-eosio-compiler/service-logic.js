'use strict';

const express = require('express');
const Router = express.Router();
const { exec, execSync } = require('child_process');
const fs = require('fs');
const copy = require('recursive-copy');
const del = require('del');
const path = require('path');
const Helper = require('./helpers');
const { Api, JsonRpc, Serialize } = require('eosjs');
const JsSignatureProvider = require('eosjs/dist/eosjs-jssig').default;
const { TextEncoder, TextDecoder } = require('util'); 
const fetch = require('node-fetch'); 

const LOG_DEST = path.resolve("./docker-eosio-cdt/stdout.txt");
const ERR_DEST = path.resolve("./docker-eosio-cdt/stderr.txt");
const DEL_TARGETS = ["./docker-eosio-cdt/contracts/**", "!./docker-eosio-cdt/contracts"];
const DEST = path.resolve("./docker-eosio-cdt/contracts");
const CWD = path.resolve('./docker-eosio-cdt')
const SHUTDOWN_CMD = './remove_eosio_cdt_docker.sh';

/**
 * How to test:
 * localhost:8081/api/eosio/deploy
 * POST request
 * 1. <source> - Absolute source file path
 * 2. <endpoint> - Blockchain endpoint
 * 3. <account_name> - account name on which the smart contract would be deployed
 * 4. <private_key> - private key of account to sign the transaction
 */
Router.post("/deploy", async (req, res) => {
    const { body } = req;

    try {
        const deletedFiles = await del(DEL_TARGETS);
        let results = null;
        console.log(typeof body["source"]);
        let compileTarget = path.basename(body["source"]);
        console.log(compileTarget);
        let endpoint = path.basename(body["endpoint"]);
        let account_name = path.basename(body["account_name"]);
        let private_key = path.basename(body["private_key"]);
        let COMPILE_SCRIPT = "";

        const directories = Helper.parseDirectoriesToInclude(path.dirname(body["source"]));
        results = await copy(path.dirname(body["source"]), DEST);
        COMPILE_SCRIPT = "./setup_eosio_cdt_docker.sh "+compileTarget+" "+directories.join(' ');

        console.log("Deleted files:\n", deletedFiles.join('\n'));
        results.forEach((file) => console.log("Copied file: ", file["src"]));
        console.log("Target entry file: ", compileTarget);

        if(fs.lstatSync(body["source"]).isDirectory()) 
            throw new Error(`${body.source} is a directory, not a valid entry file!`);

        exec(COMPILE_SCRIPT, {
            cwd: CWD
        }, (err, stdout, stderr) => {
          console.log('compile script ran');
            execSync(SHUTDOWN_CMD, {
                cwd: CWD
            })
            let parsedStdOut = Helper.parseLog(fs.readFileSync(LOG_DEST, 'utf-8'));
            let parsedStdErr = Helper.parseLog(fs.readFileSync(ERR_DEST, 'utf-8'));
            if (err) {
                let message = (err.message) ? err.message : message;
                res.send({
                    compiled: false,
                    errors: [
                      message
                    ],
                    stdout: parsedStdOut,
                    stderr: parsedStdErr
                });
            } else {
                const COMPILED_CONTRACTS = path.resolve(
                    "./docker-eosio-cdt/compiled_contracts/" + 
                    path.basename(compileTarget, '.cpp')
                );
                const { wasmPath, abiPath, abiContents = {}, programErrors } = Helper.fetchDeployableFilesFromDirectory(COMPILED_CONTRACTS);
                if (programErrors.length > 0) {
                    res.send({
                        compiled: false,
                        errors: programErrors,
                        stdout: parsedStdOut,
                        stderr: parsedStdErr
                    })
                } else {
                    console.log(`stdout: ${stdout}`);
                    deployContract(endpoint, account_name, private_key, wasmPath, abiPath)
                    .then(result => {
                      console.log("Contract deployed successfully ", result);
                      res.send({
                        compiled: true,
                        wasmLocation: wasmPath,
                        abi: abiPath,
                        deployed: true,
                        abiContents: abiContents,
                        errors: [],
                        output: result,
                        stdout: parsedStdOut,
                        stderr: parsedStdErr
                      });
                    })
                    .catch((err) => {
                      let message = (err.message) ? err.message : err;
                      console.log("Caught error: ", err, message);
                      res.send({
                        compiled: true,
                        wasmLocation: wasmPath,
                        abi: abiPath,
                        abiContents: abiContents,
                        deployed: false,
                        errors: [
                          message
                        ],
                        stdout: parsedStdOut,
                        stderr: parsedStdErr
                      });
                    });
                }
            }
        });
    } catch (ex) {
        console.log(ex);
        res.send({
            compiled: false,
            stderr: ex,
            errors: [
                ex.message
            ]
        })
    }
});

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
      COMPILE_SCRIPT = "./setup_eosio_cdt_docker.sh "+compileTarget+" "+directories.join(' ');

      console.log("Deleted files:\n", deletedFiles.join('\n'));
      results.forEach((file) => console.log("Copied file: ", file["src"]));
      console.log("Target entry file: ", compileTarget);

      if(fs.lstatSync(body["source"]).isDirectory()) 
          throw new Error(`${body.source} is a directory, not a valid entry file!`);

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
          const { wasmPath, abiPath, abiContents = {}, programErrors } = Helper.fetchDeployableFilesFromDirectory(COMPILED_CONTRACTS);
          if (programErrors.length > 0) {
              res.send({
                  compiled: false,
                  errors: programErrors,
                  stdout: parsedStdOut,
                  stderr: parsedStdErr
              })
          } else {
            res.send({
              compiled: true,
              wasmLocation: wasmPath,
              abi: abiPath,
              abiContents: abiContents,
              errors: programErrors,
              stdout: parsedStdOut,
              stderr: parsedStdErr
            });
          }
        }
      })
    } catch (ex) {
      res.send({
        compiled: false,
        stderr: ex,
        errors: [
            ex.message
        ]
      })
    }
});

/****
 * How to test:
 * localhost:8081/api/eosio/import
 * The page should handle this for you.
 * 1. <abiName>
 * 2. <content>
 */
Router.post("/import", async (req, res) => {
    const { body } = req;
    const IMPORT_FOLDER = path.resolve("./docker-eosio-cdt/imported_abi/");
    const DESTINATION = path.resolve("./docker-eosio-cdt/imported_abi/"+body["abiName"]);
    try {

      if (!fs.lstatSync(IMPORT_FOLDER).isDirectory())
        fs.mkdirSync(IMPORT_FOLDER, {recursive:true});
      else {
        const clearImport = await del(["./docker-eosio-cdt/imported_abi/"+body["abiName"]]);
        console.log("Cleared old import: ", clearImport);
      }

      fs.writeFile(DESTINATION, body["content"], (err) => {
        if (err) {
          console.log(err);
          res.send({
            imported: false,
            errors: [
              err.message
            ]
          });
        } else {
          console.log("ABI imported to path: "+DESTINATION);
          res.send({
            imported: true,
            abiPath: DESTINATION.toString(),
            errors: []
          });
        }
      })
    } catch (ex) {
      res.send({
        imported: false,
        errors: [
          ex.message
        ]
      })
    }
})

async function deployContract(blockchainUrl, account_name, private_key, wasm_path, abi_path){
  if(blockchainUrl.indexOf("http://") < 0)
  {
    blockchainUrl = "http://" + blockchainUrl;
  }

  const rpc = new JsonRpc(blockchainUrl, { fetch });
  const signatureProvider = new JsSignatureProvider([private_key]);
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  const buffer = new Serialize.SerialBuffer({
    textEncoder: api.textEncoder,
    textDecoder: api.textDecoder,
  });

  const wasm = fs.readFileSync(wasm_path).toString('hex');
  let abi = JSON.parse(fs.readFileSync(abi_path, 'utf8'));

  const abiDefinition = api.abiTypes.get('abi_def');
  // need to make sure abi has every field in abiDefinition.fields
  // otherwise serialize throws error
  abi = abiDefinition.fields.reduce(
      (acc, { name: fieldName }) => Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
      abi,
  );
  abiDefinition.serialize(buffer, abi);

  try{
    return await api.transact(
      {
        actions: [
          {
            account: 'eosio',
            name: 'setcode',
            authorization: [
              {
                actor: account_name,
                permission: 'active',
              },
            ],
            data: {
              account: account_name,
              vmtype: 0,
              vmversion: 0,
              code: wasm,
            },
          },
          {
            account: 'eosio',
            name: 'setabi',
            authorization: [
              {
                actor: account_name,
                permission: 'active',
              },
            ],
            data: {
              account: account_name,
              abi: Buffer.from(buffer.asUint8Array()).toString('hex'),
            },
          },
        ],
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      }
    );
  }
  catch(err){
    throw("Error while deploying contract - " + err)
  }
}

module.exports = Router;
