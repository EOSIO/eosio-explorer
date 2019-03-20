#!/usr/bin/env bash
set -o errexit

# change to script's directory
cd "$(dirname "$0")"

echo "=== run docker container from the eosio-gui-nodeos-cdt:1.5.0 image ==="
# -d: Detach docker container, let it run in background
# --name: Assign name to the container
# --mount: Mount filesystem from host to container. 
# -w: Enforce working directory inside the container.
docker run -i --name eosio_gui_nodeos_cdt_container -d \
--mount type=bind,src="$(pwd)"/contracts,dst=/opt/eosio/bin/contracts \
--mount type=bind,src="$(pwd)"/scripts,dst=/opt/eosio/bin/scripts \
-w "/opt/eosio/bin" eosio-gui-nodeos-cdt:1.5.0 /bin/sh 
