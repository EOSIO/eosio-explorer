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
echo "[Quick Start Engage] Attempt compilation..."
./start_eosio_cdt_docker.sh notechain
