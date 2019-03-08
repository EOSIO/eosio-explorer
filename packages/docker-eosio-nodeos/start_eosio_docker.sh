#!/usr/bin/env bash
set -o errexit

# change to script's directory
cd "$(dirname "$0")"

if [ -e "data/initialized" ]
then
    script="./scripts/continue_blockchain.sh"
else
    script="./scripts/init_blockchain.sh"
fi

echo "=== run docker container from the eosio-gui-nodeos:eos1.6.3 image ==="
docker run --rm --name eosio_gui_nodeos_container -d \
-p 8888:8888 -p 9876:9876 \
--net host \
--mount type=bind,src="$(pwd)"/contracts,dst=/opt/eosio/bin/contracts \
--mount type=bind,src="$(pwd)"/scripts,dst=/opt/eosio/bin/scripts \
--mount type=bind,src="$(pwd)"/data,dst=/mnt/dev/data \
-w "/opt/eosio/bin/" eosio-gui-nodeos:eos1.6.3 /bin/bash -c "$script"

if [ "$1" != "--nolog" ]
then
    echo "=== follow eosio_gui_nodeos_container logs ==="
    docker logs eosio_gui_nodeos_container --follow
fi
