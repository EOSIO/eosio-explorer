#!/usr/bin/env bash
set -o errexit

NC='\033[0m' # No Color
GREEN='\033[0;32m'

ROOTPATH="../.."

# sourcing variable from config file
source ./config.file

# override config if there are any local config changes
if [ -f "./config.file.local" ]; then
  source ./config.file.local
fi

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
    docker volume rm --force $MONGODB_VOLUME_NAME
    sleep 10 #else docker fails  sometimes
    (cd ${ROOTPATH}/packages/ && exec docker-mongodb/start_mongodb_docker.sh && printf "${GREEN}restarted${NC}")
fi

if [ "$(docker ps -q -f name=$NODEOS_CONTAINER_NAME)" ]; then
    if [ "$(docker ps -aq -f status=running -f name=$NODEOS_CONTAINER_NAME)" ]; then
        echo "=== Blockchain container is already running. ==="
    else
        if [ "$(docker ps -aq -f status=paused -f name=$NODEOS_CONTAINER_NAME)" ]; then
            echo "=== Resuming paused blockchain container... ==="
            docker unpause $NODEOS_CONTAINER_NAME
        fi
    fi
else
    if [ "$(docker volume ls --format '{{.Name}}' -f name=$NODEOS_VOLUME_NAME)" ]; then
      echo "eosio docker is not running, but eosio volume exists"
      echo "cleaning data now"
      docker volume rm --force $NODEOS_VOLUME_NAME
      sleep 10
    fi
    echo "=== Blockchain container not found, restarting it instead ==="
    (cd ${ROOTPATH}/packages/ && exec docker-eosio-nodeos/start_eosio_docker.sh && printf "${GREEN}Restarted${NC}")
fi
