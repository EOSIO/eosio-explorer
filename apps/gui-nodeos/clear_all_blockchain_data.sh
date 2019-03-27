#!/usr/bin/env bash
set -o errexit

EXECPATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOTPATH="../..";

echo "=== Checking if nodeos container is running... ==="
if [ "$(docker ps -q -f name=eosio_gui_nodeos_container)" ]; then
    if [ "$(docker ps -aq -f status=running -f name=eosio_gui_nodeos_container)" ]; then
        echo "=== Blockchain container is running, stopping the operation... ==="
        docker stop eosio_gui_nodeos_container
    fi
fi

echo "=== reinitializing nodeos with cleared blockchain ==="
(cd ${ROOTPATH}/packages/ && exec docker-eosio-nodeos/first_time_setup.sh)

echo "=== reinitializing mongodb ==="
(cd ${ROOTPATH}/packages/ && exec docker-mongodb/remove_mongodb_docker.sh)
