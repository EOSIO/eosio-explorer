#!/usr/bin/env bash
set -o errexit

# Checks if the Docker container is already running. If it is, then compile the contract as normal.
if [ "$(docker ps -q -f name=eosio_gui_nodeos_container)" ]; then
    if [ "$(docker ps -aq -f status=running -f name=eosio_gui_nodeos_container)" ]; then
        echo "=== Blockchain container is running, stopping the operation... ==="
        docker stop eosio_gui_nodeos_container
    fi
fi

if [ ! "$(docker ps -q -f name=eosio_gui_nodeos_container)" ]; then
    echo "=== Blockchain container is either paused or not running. Please start it up. ==="
fi
