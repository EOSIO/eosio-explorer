#!/usr/bin/env bash
set -o errexit

# Verify everything is clean and setup properly
echo "[Quick Start Engage] First time setup..."
./first_time_setup.sh

# Engage EOSIO.CDT Docker ephemeral container
# Step 1: Run container
# Step 2: Mount contract files to container
# Step 3: Compile contract
# Step 4: Copy compiled contract to host folder
echo "[Quick Start Engage] Create container eosio_gui_nodeos_cdt_container..."
./start_eosio_cdt_docker.sh 

echo "[Quick Start Engage] Attempt compilation of smart contract file"
docker exec -it eosio_gui_nodeos_cdt_container ./scripts/compile_contract.sh eosio.token &> log.txt

echo "--> See log.txt for piped file..."
echo "[Quick Start Engage] Attempt copying of smart contract..."
docker cp eosio_gui_nodeos_cdt_container:/opt/eosio/bin/compiled_contracts/eosio.token "$(pwd)"/compiled_contracts

echo "--> Copied smart contract"
