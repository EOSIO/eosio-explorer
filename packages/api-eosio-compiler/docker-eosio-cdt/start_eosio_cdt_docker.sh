#!/usr/bin/env bash
set -o errexit

# change to script's directory
cd "$(dirname "$0")"

echo "=== clear compiled_contracts cache ==="
# clean out the previous compiled contracts
rm -rf compiled_contracts
mkdir compiled_contracts

echo "=== run docker container from the eosio-gui-nodeos-cdt:1.5.0 image ==="
# -i: Keep STDIN open even when detached
# -d: Detach docker container, let it run in background
# --name: Assign name to the container
# --mount: Mount filesystem from host to container. 
# -w: Enforce working directory inside the container.
docker run -i --name eosio_gui_nodeos_cdt_container -d \
--mount type=bind,src="$(pwd)"/contracts,dst=/opt/eosio/bin/contracts \
--mount type=bind,src="$(pwd)"/scripts,dst=/opt/eosio/bin/scripts \
-w "/opt/eosio/bin" eosio-gui-nodeos-cdt:1.5.0 /bin/sh

# Execute compilation command
# Pos $1 arg: System file path. 
echo "=== Attempt compilation of smart contract file... ==="
docker exec -it eosio_gui_nodeos_cdt_container ./scripts/compile_contract.sh $1

# Copy file from container to host machine
# TODO: local_service.js needs folder path shared same name as entry point file....?
echo "=== Compilation complete, copying to host terminal ==="
docker cp eosio_gui_nodeos_cdt_container:/opt/eosio/bin/compiled_contracts/$1 "$(pwd)"/compiled_contracts

# Remove container after copying is completed...
docker rm -fv eosio_gui_nodeos_cdt_container
