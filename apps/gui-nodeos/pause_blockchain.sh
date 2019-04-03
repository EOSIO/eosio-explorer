#!/usr/bin/env bash
set -o errexit

# Checks if the Docker container is already running. If it is, then compile the contract as normal.
if [ "$(docker ps -q -f name=eosio_gui_nodeos_container)" ]; then
    if [ "$(docker ps -aq -f status=running -f name=eosio_gui_nodeos_container)" ]; then
        echo "=== Blockchain container is running, stopping the operation... ==="
        docker pause eosio_gui_nodeos_container
    else
        echo "=== Blockchain container not running... ==="
    fi
fi

if [ "$(docker ps -aq -f name=eosio-mongodb)" ]; then
    if [ "$(docker ps -aq -f status=running -f name=eosio-mongodb)" ]; then
        echo "=== MongoDB container is running, stopping the operation ==="
        docker pause eosio-mongodb
    else 
        echo "=== MongoDB container not running... ==="
    fi
fi