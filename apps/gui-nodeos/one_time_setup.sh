#!/usr/bin/env bash
set -o errexit

EXECPATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOTPATH="../..";

echo "=== please run this only for first time setup... ==="

echo "1. [docker-eosio-nodeos] setup"
(cd ${ROOTPATH}/packages/ && exec docker-eosio-nodeos/first_time_setup.sh)

echo "2. [api-eosio-compiler] setup"
(cd ${ROOTPATH}/packages/ && exec api-eosio-compiler/docker-eosio-cdt/first_time_setup.sh)

echo "=== setup finished. ==="
