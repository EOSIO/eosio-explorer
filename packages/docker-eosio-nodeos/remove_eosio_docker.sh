#!/usr/bin/env bash
set -o errexit

# change to script's directory
cd "$(dirname "$0")"

docker stop eosio_notechain_container

rm -rf data

mkdir data
