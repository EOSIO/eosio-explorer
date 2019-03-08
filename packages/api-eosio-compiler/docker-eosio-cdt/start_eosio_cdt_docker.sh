#!/usr/bin/env bash
set -o errexit

# change to script's directory
cd "$(dirname "$0")"

echo "=== run docker container from the eosio-gui-nodeos-cdt:1.5.0 image ==="
docker run -i --name eosio_gui_nodeos_cdt_container \
eosio-gui-nodeos-cdt:1.5.0 /bin/bash
