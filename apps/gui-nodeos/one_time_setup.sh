#!/usr/bin/env bash
set -o errexit

echo "=== please run this only for first time setup... ==="

echo "1. [docker-eosio-nodeos] setup inside ${HOME}..."
(cd ${HOME}/eos-toppings/packages/ && exec docker-eosio-nodeos/first_time_setup.sh)

echo "2. [api-eosio-compiler] setup inside ${HOME}..."
(cd ${HOME}/eos-toppings/packages/ && exec api-eosio-compiler/docker-eosio-cdt/first_time_setup.sh)

echo "=== setup finished. ==="
