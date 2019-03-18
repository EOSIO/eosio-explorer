#!/usr/bin/env bash
set -o errexit

echo "=== booting up MongoDB Docker Container ==="
echo "Script location: ${HOME}/eos-toppings/packages/docker-mongodb"
(cd ${HOME}/eos-toppings/packages/ && exec docker-mongodb/start_mongodb_docker.sh )

echo "=== MongoDB Docker Container done, spinning up Nodeos ==="
echo "Script location: ${HOME}/eos-toppings/packages/docker-eosio-nodeos"
(cd ${HOME}/eos-toppings/packages/ && exec docker-eosio-nodeos/start_eosio_docker.sh )
