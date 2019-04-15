#!/usr/bin/env bash
set -o errexit

ROOTPATH="../.."

# sourcing variable from config file
source ./config.file

echo "=== Checking if nodeos container is running... ==="
if [ "$(docker ps -q -f name=$NODEOS_CONTAINER_NAME)" ]; then
    if [ "$(docker ps -aq -f status=running -f name=$NODEOS_CONTAINER_NAME)" ]; then
        echo "=== Blockchain container is running, stopping the operation... ==="
        docker stop $NODEOS_CONTAINER_NAME
    fi
fi

echo "=== reinitializing nodeos with cleared blockchain ==="
(cd ${ROOTPATH}/packages/ && exec docker-eosio-nodeos/start_eosio_docker.sh)

echo "=== reinitializing mongodb ==="
(cd ${ROOTPATH}/packages/ && exec docker-mongodb/remove_mongodb_docker.sh && exec docker-mongodb/start_mongodb_docker.sh)
