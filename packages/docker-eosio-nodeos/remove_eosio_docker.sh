#!/usr/bin/env bash
set -o errexit

# change to script's directory
cd "$(dirname "$0")"

docker stop eosio_gui_nodeos_container || true

rm -rf data

mkdir data
