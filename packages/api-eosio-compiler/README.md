# api-eosio-compiler <img alt="NPM Version" src="https://img.shields.io/npm/v/EOSIO/api-eosio-compiler.svg">
Self-contained Node.JS server that can perform the following functions:
* Compile a smart contract to generate an `.abi` file
* Compile and deploy a smart contract to the blockchain in a single step
* Import a ready-made `.abi` file to go with the deployment of a smart contract

Under the hood, these functions create a Docker container running `eosio.cdt`. More information about this can be viewed [here](./docker-eosio-cdt). 

## Installation

Navigate to the root of this package and run `yarn install` if running separately from the rest of the tools. Once all dependencies have been installed, navigate to the `./docker-eosio-cdt` folder and run `./build_eosio_cdt_docker.sh` to build the Docker image. This is necessary as the service will execute shell script code which spins up the Docker container transiently (disposed after it has finished the task). 

Afterwards, navigate back to the root and do `yarn start` to spin up the local service.

## Endpoints

### `/api/eosio/compile` - `POST` method
A `POST` method that compiles a group of source files for the smart contract based on a provided `source` input. It accepts the following as parameters:
1. `source` - `<String>` - An absolute file path to the entry file of the smart contract. The filename with file extension will be passed to `eosio-cpp` as the primary argument for compilation.

It will return the following:
```
{
    wasmLocation: - <String> - full path of the compiled WASM file
    abi: - <String> - full path of the ABI file
    abiContents: - <String> - Stringified contents of the ABI file
    errors: - <Array[String]> - List of possible errors
    stdout: - <Array[String]> - Line by line contents of the standard output of the compiler
    stderr: - <Array[String]> - Line by line contents of the standard error of the compiler
    compiled: - <Boolean> - Helper field to determine if file has been compiled or not
}
```

Note, that it will use the folder containing the entry file indicated in `source` as the container for all dependencies of the file. 

### `/api/eosio/import` - `POST` method
A `POST` method which takes a file name and the contents of that file as an input, writing the file to a pre-determined location in the API server so it can be used for smart contract deployment. Use this API method as a back up for cases when compiling the ABI did not work. It accepts the following as parameters:
1. `abiName` - `<String>` - A file name with file extension such as `abi_file.abi` 
2. `content` - `<String>` - The raw stringified content of the `.abi` file to import

It will return the following:
```
{
    abiPath: - <String> - The full path of the imported ABI file
    errors: - <Array[String]> - List of possible errors
    imported: - <Boolean> - Helper field to determine if the file has been compiled or not
}
```

### `/api/eosio/deploy` - `POST` method
A `POST` method that compiles a group of source code files for the smart contract based on a provided `source` input. Afterwards, it will deploy the compiled smart contract to the blockchain at `endpoint` with the `account_name` permission signed with `private_key`. Optionally, if `abiSource` is provided, the service will use the `.abi` file at `abiSource` instead of generating the `.abi` file itself. It accepts the following as parameters:
1. `source` - `<String>` - An absolute file path to the entry file of the smart contract. The filename with file extension will be passed to `eosio-cpp` as the primary argument for compilation.
2. `endpoint` - `<String>` - The full endpoint of the `nodeos` instance the user wishes to deploy the contract to
3. `account_name` - `<String>` - The name of the account that will sign and deploy this contract
4. `private_key` - `<String>` - The private key of the account's permission. Be aware to use the correct private key. Otherwise, you may receive an error.
5. [`abiSource`] - `<String>` - An absolute file path to the imported `.abi` file to use instead of the default behavior. Optional field. 

It will return the following:
```
{
    wasmLocation: - <String> - full path of the compiled WASM file
    abi: - <String> - full path of the ABI file
    abiContents: - <String> - Stringified contents of the ABI file
    output: - <Object> - Trimmed result of the deployment action, in cases of deployment success
    errors: - <Array[String]> - List of possible errors
    stdout: - <Array[String]> - Line by line contents of the standard output of the compiler
    stderr: - <Array[String]> - Line by line contents of the standard error of the compiler
    compiled: - <Boolean> - Helper field to determine if file has been compiled or not
    deployed: - <Boolean> - Helper field to determine if file has been deployed or not
}
```

Note, that it will use the folder containing the entry file indicated in `source` as the container for all dependencies of the file. 
