#!/usr/bin/env bash
set -o errexit

echo "creating blockchain accounts and deploying smart contract"

# set PATH
PATH="$PATH:/opt/eosio/bin:/opt/eosio/bin/scripts"

# sourcing variable from config file
source ./scripts/config.file

# override config if there are any local config changes
if [ -f "./scripts/config.file.local" ]; then
  source ./scripts/config.file.local
fi

# set contracts path
CONTRACTSPATH="$( pwd -P )/contracts"

set -m

# start nodeos ( local node of blockchain )
# run it in a background job such that docker run could continue
nodeos -e -p eosio -d /mnt/dev/data \
  --signature-provider EOS5GnobZ231eekYUJHGTcmy2qve1K23r5jSFQbMfwWTtPB7mFZ1L=KEY:5Jr65kdYmn33C3UabzhmWDm2PuqbRfPuDStts3ZFNSBLM7TqaiL \
  --config-dir /mnt/dev/config \
  --plugin eosio::mongo_db_plugin -m $MONGODB_PATH  \
  --http-validate-host=false \
  --plugin eosio::producer_plugin \
  --plugin eosio::chain_api_plugin \
  --plugin eosio::http_plugin \
  --http-server-address=0.0.0.0:8888 \
  --access-control-allow-origin=* \
  --contracts-console \
  --max-transaction-time 300 \
  --verbose-http-errors \
  --genesis-json "./scripts/genesis.json" &

# wait for blockchain to start
sleep 1s
until curl localhost:8888/v1/chain/get_info
do
  sleep 1s
done

echo "create wallet: eosio"
# First key import is for eosio system account
cleos wallet create -n eosio --to-console | tail -1 | sed -e 's/^"//' -e 's/"$//' > eosio_wallet_password.txt
cleos wallet import -n eosio --private-key 5Jr65kdYmn33C3UabzhmWDm2PuqbRfPuDStts3ZFNSBLM7TqaiL

# deploy bios contract, this is required in getABI for system contracts 
echo "deploying bios contract"
deploy_contract.sh eosio.bios eosio eosio $(cat eosio_wallet_password.txt) true

echo "end of setting up blockchain accounts and smart contract"

# create a file to indicate the blockchain has been initialized
touch "/mnt/dev/data/initialized"

# put the background nodeos job to foreground for docker run
fg %1
