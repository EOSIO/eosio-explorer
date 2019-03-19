#!/usr/bin/env bash
set -o errexit

EXECPATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOTPATH="../..";

echo "=== stopping the nodeos container... ==="
docker stop eosio_gui_nodeos_container

echo "=== reinitializing nodeos with cleared blockchain ==="
(cd ${ROOTPATH}/packages/ && exec docker-eosio-nodeos/first_time_setup.sh)

echo "=== reinitializing mongodb ==="
(cd ${ROOTPATH}/packages/ && exec docker-mongodb/remove_mongodb_docker.sh)
