#!/usr/bin/env bash
set -o errexit

echo "=== setup blockchain accounts and smart contract ==="

#This variable should be moved out to a global config file
MONGODB_PATH="mongodb://localhost:27017/mongopluginmainnet"

# set PATH
PATH="$PATH:/opt/eosio/bin:/opt/eosio/bin/scripts"

set -m

# start nodeos ( local node of blockchain )
# run it in a background job such that docker run could continue
nodeos -e -p eosio -d /mnt/dev/data \
  --config-dir /mnt/dev/config \
  --plugin eosio::mongo_db_plugin -m $MONGODB_PATH  \
  --http-validate-host=false \
  --plugin eosio::producer_plugin \
  --plugin eosio::chain_api_plugin \
  --plugin eosio::http_plugin \
  --http-server-address=0.0.0.0:8888 \
  --access-control-allow-origin=* \
  --contracts-console \
  --verbose-http-errors &
sleep 1s
until curl localhost:8888/v1/chain/get_info
do
  sleep 1s
done

echo "=== setup wallet: eosio ==="
# First key import is for eosio system account
cleos wallet create -n eosio --to-console | tail -1 | sed -e 's/^"//' -e 's/"$//' > eosio_wallet_password.txt
cleos wallet import -n eosio --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

# create a file to indicate the blockchain has been initialized
touch "/mnt/dev/data/initialized"

# put the background nodeos job to foreground for docker run
fg %1
