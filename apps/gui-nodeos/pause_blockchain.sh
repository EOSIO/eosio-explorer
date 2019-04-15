#!/usr/bin/env bash
set -o errexit

# sourcing variable from config file
source ./config.file

# Checks if the Docker container is already running. If it is, then compile the contract as normal.
if [ "$(docker ps -q -f name=$NODEOS_CONTAINER_NAME)" ]; then
    if [ "$(docker ps -aq -f status=running -f name=$NODEOS_CONTAINER_NAME)" ]; then
        echo "=== Blockchain container is running, stopping the operation... ==="
        docker pause $NODEOS_CONTAINER_NAME
    else
        echo "=== Blockchain container not running... ==="
    fi
fi

if [ "$(docker ps -aq -f name=$MONGODB_CONTAINER_NAME)" ]; then
    if [ "$(docker ps -aq -f status=running -f name=$MONGODB_CONTAINER_NAME)" ]; then
        echo "=== MongoDB container is running, stopping the operation ==="
        docker pause $MONGODB_CONTAINER_NAME
    else
        echo "=== MongoDB container not running... ==="
    fi
fi
