# apps/gui-nodeos

Sample shell script utilities for directly controlling the blockchain container.

## Contents

* `build_dockers.sh` - Script to build the Docker images and containers under `packages/docker-eosio-nodeos` and `packages/api-eosio-compiler/docker-eosio-cdt`
* `start_blockchain.sh` - Script to start the blockchain
* `pause_blockchain.sh` - Script to pause the blockchain
* `resume_blockchain.sh` - Script to resume the blockchain
* `clear_all_blockchain_data.sh` - Script to re-initialize all data in the blockchain and MongoDB in case a hard reset is needed

## Sample Usage

1. `./build_dockers.sh` to ensure the necessary containers are available
2. `./start_blockchain.sh` to start a blockchain instance for development

Eventually, you can use `pause_blockchain.sh` and `resume_blockchain.sh` to pause and/or resume the blockchain on demand. Furthermore, you could even modify or use these scripts in higher level processes or build tasks.