# docker-eosio-cdt
Responsible for creating the Docker container to compile the smart contract. Importantly, the deployment step is done inside the API server by making use of `packages/api-rpc`. 

## Folder Content
The contents of this folder will frequently change as the service is being used. To be sure that your installation is working correctly, check for these folders:

* **contracts** - Folder which contains source code files for a smart contract. 
* **compiled_contracts** - Will only be made after you have compiled or deployed your first smart contract. This will contain generated `.abi` and `.wasm` files, but may be cleaned out periodically.
* **imported_abi** - Folder which contains imported `.abi` files. New versions of existing `.abi` files will overwrite whatever is in here.
* **scripts** - Folder containing scripts that will be used by the Docker container. This folder, along with **contracts** is mounted into the Docker container when it is created.

## Setup

Navigate to the root of this folder and then execute `./build_eosio_cdt_docker.sh` to create the Docker image for this service. Once you have the Docker image available, you can already run the local service. However, the scripts which are used by the local service are also available here. 

## Usage

The script which performs the entire compilation process can be found in the `setup_eosio_cdt_docker.sh` script, which you can find [here](./setup_eosio_cdt_docker.sh). It requires one argument to be passed to it, which is the absolute file path of the entry file which will be compiled by `eosio-cpp`. 