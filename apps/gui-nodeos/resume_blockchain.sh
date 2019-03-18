#!/usr/bin/env bash
set -o errexit

# Checks if the Docker container is already running. If it is, then compile the contract as normal.
if [ "$(docker ps -q -f name=eosio_gui_nodeos_container)" ]; then
    if [ "$(docker ps -aq -f status=running -f name=eosio_gui_nodeos_container)" ]; then
        echo "=== Blockchain container is already running. ==="
    fi
fi

if [ ! "$(docker ps -q -f name=eosio_gui_nodeos_container)" ]; then
    echo "=== Resuming blockchain container... ==="
    echo "Script location: ${HOME}/eos-toppings/packages/docker-eosio-nodeos"
    (cd ${HOME}/eos-toppings/packages/ && exec docker-eosio-nodeos/start_eosio_docker.sh )
fi
