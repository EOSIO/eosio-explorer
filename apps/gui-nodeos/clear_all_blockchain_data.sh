#!/usr/bin/env bash
set -o errexit

ROOTPATH="../.."

echo "=== Checking if nodeos container is running... ==="
if [ "$(docker ps -q -f name=eosio_gui_nodeos_container)" ]; then
    if [ "$(docker ps -aq -f status=running -f name=eosio_gui_nodeos_container)" ]; then
        echo "=== Blockchain container is running, stopping the operation... ==="
        docker stop eosio_gui_nodeos_container
    fi
fi

echo "=== reinitializing nodeos with cleared blockchain ==="
(cd ${ROOTPATH}/packages/ && exec docker-eosio-nodeos/start_eosio_docker.sh)

echo "=== reinitializing mongodb ==="
(cd ${ROOTPATH}/packages/ && exec docker-mongodb/remove_mongodb_docker.sh && exec docker-mongodb/start_mongodb_docker.sh)
