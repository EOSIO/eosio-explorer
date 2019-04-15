#!/usr/bin/env bash
set -o errexit

NC='\033[0m' # No Color
GREEN='\033[0;32m'

ROOTPATH="../.."

# sourcing variable from config file
source ./config.file

if [ "$(docker ps -q -f name=$MONGODB_CONTAINER_NAME)" ]; then
    if [ "$(docker ps -aq -f status=running -f name=$MONGODB_CONTAINER_NAME)" ]; then
        echo "=== MongoDB container is already running. ==="
    else
        if [ "$(docker ps -aq -f status=paused -f name=$MONGODB_CONTAINER_NAME)" ]; then
            echo "=== Resuming paused MongoDB container... ==="
            docker unpause $MONGODB_CONTAINER_NAME
        fi
    fi
else
    echo "=== MongoDB Container not found, restarting it instead ==="
    (cd ${ROOTPATH}/packages/ && exec docker-mongodb/start_mongodb_docker.sh && printf "${GREEN}restarted${NC}")
fi

if [ "$(docker ps -q -f name=eosio_gui_nodeos_container)" ]; then
    if [ "$(docker ps -aq -f status=running -f name=eosio_gui_nodeos_container)" ]; then
        echo "=== Blockchain container is already running. ==="
    else
        if [ "$(docker ps -aq -f status=paused -f name=eosio_gui_nodeos_container)" ]; then
            echo "=== Resuming paused blockchain container... ==="
            docker unpause eosio_gui_nodeos_container
        fi
    fi
else
    if find "$EOSDOCKER/data" -mindepth 1 -print -quit 2>/dev/null | grep -q .; then
        echo "=== Blockchain container is not running, but old data folder exists ==="
        echo ">>> CLEANING..."
        rm -r ${ROOTPATH}/packages/docker-eosio-nodeos/data/*
        sleep 10 #else docker fails  sometimes
    fi
    echo "=== Blockchain container not found, restarting it instead ==="
    (cd ${ROOTPATH}/packages/ && exec docker-eosio-nodeos/start_eosio_docker.sh && printf "${GREEN}Restarted${NC}")
fi
