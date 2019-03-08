#!/usr/bin/env bash
set -o errexit

# change to script's directory
cd "$(dirname "$0")"

docker stop eosio-mongodb

rm -rf data

mkdir data

docker rm eosio-mongodb
