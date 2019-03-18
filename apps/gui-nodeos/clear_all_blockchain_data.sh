#!/usr/bin/env bash
set -o errexit

echo "=== stopping the nodeos container... ==="
docker stop eosio_gui_nodeos_container

echo "=== reinitializing nodeos with cleared blockchain ==="
(cd ${HOME}/eos-toppings/packages/ && exec docker-eosio-nodeos/first_time_setup.sh)

echo "=== reinitializing mongodb ==="
(cd ${HOME}/eos-toppings/packages/ && exec docker-mongodb/remove_mongodb_docker.sh)
