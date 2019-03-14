# Introduction
Modularized Node.JS process that spawns child processes responsible for spinning up ephemeral Docker containers with eosio.cdt. It will compile the smart contract source and then the resulting ABI and WASM files will be copied from the container to the host terminal. 

# Depended by Packages
* ui-gui-nodeos

# Used by Applications
* GUI of Nodeos

# Development

## Docker Component

`cd` into `/packages/api-eosio-compiler/docker-eosio-cdt`

### Development Quick Start

Running `./quick_start.sh` will bundle both the first time setup step and the Docker spinup at once.
The `./quick_start.sh` script is **hard coded** to compile the **eosio.token** smart contract which inside the root of the directory `./contracts`. This is just for you to test the flow of compiling and copying the WASM and ABI files from container to host terminal. 

### First Time Setup

First time setup can be initialized by running `./first_time_setup.sh`

### Docker 

Spin up a container that mounts input source code and compiles it using `eosio-cpp` by running `./start_eosio_cdt_docker.sh` with an extra argument denoting the folder inside `contracts`.

`local_service.js` is responsible for filesystem manipulating so source files go into the correct places...

It will copy the files into a `compiled_contracts/<name_of_smart_contract>` folder. Kindly view `compile_contract.sh` for reference.

## `local_service` component

`local_service.js` will start a very lightweight Express application server on PORT `8081`. It consists of, currently, only a single API endpoint at `localhost:8081/api/eosio/compile`. (Can be changed)

It should do the following:
1. Accept file or folder. Ideally folder path. Also requires the name of the entry file
2. Place the source code files into `contracts/...`
3. Spin up the Docker script using `exec`
4. Inspect `compiled_contracts/...`, getting the correct folder based on the entry file's name. 
5. Present ABI file to the frontend.
