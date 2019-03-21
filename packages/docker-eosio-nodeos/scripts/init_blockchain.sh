#!/usr/bin/env bash
set -o errexit

echo "=== setup blockchain accounts and smart contract ==="

#This variable should be moved out to a global config file
# 'eosio-mongodb' is the name of the mongo container, 
MONGODB_PATH="mongodb://eosio-mongodb:27017/mongopluginmainnet"

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

echo "=== setup wallet: hellowal ==="
## key for eosio account and export the generated password to a file for unlocking wallet later
cleos wallet create -n hellowal --to-console | tail -1 | sed -e 's/^"//' -e 's/"$//' > hello_wallet_password.txt
## Owner key for hellowal wallet
cleos wallet import -n hellowal --private-key 5JrDP7knfwybgxbVbmWVqmNtexindWpAeVs2divw7WDiLyjkDJU
# # Active key for hellowal wallet
cleos wallet import -n hellowal --private-key 5JEb8Qzy6ZTfs9mGdKKSZL1GB4Lxbj3uPnWFbm652GS9RQQHmHa

# # * Replace "hellowal" by your own wallet name when you start your own project

# # create account for helloacc with above wallet's public keys
 cleos create account eosio helloacc EOS8mQ4RVYYsNXfpPCiJew4FxEo3viBTEaTgPtdHXKceMdNvqmTzK EOS71ndY36kez1mWzTX4XRf7FK4TpPYKmN9Q1BPW9LBGR9LyKSTb1

# # * Replace "helloacc" by your own account name when you start your own project

echo "=== deploy smart contract ==="
# $1 smart contract name
# $2 account holder name of the smart contract
# $3 wallet for unlock the account
# $4 password for unlocking the wallet
 deploy_contract.sh helloworld helloacc hellowal $(cat hello_wallet_password.txt)

echo "=== create user accounts ==="
# script for create data into blockchain
create_accounts.sh

echo "=== send test transactions ==="
# script for create data into blockchain
cleos push action helloacc sendmsg '["msg1"]' -p helloacc@active
sleep 10
cleos push action helloacc sendmsg '["msg2"]' -p helloacc@active
cleos push action helloacc sendmsg '["msg3"]' -p helloacc@active
sleep 10
cleos push action helloacc sendmsg '["msg4"]' -p helloacc@active
cleos push action helloacc sendmsg '["msg5"]' -p helloacc@active
cleos push action helloacc sendmsg '["msg6"]' -p helloacc@active
# * Replace the script with different form of data that you would pushed into the blockchain when you start your own project

echo "=== end of setup blockchain accounts and smart contract ==="

# create a file to indicate the blockchain has been initialized
touch "/mnt/dev/data/initialized"

# put the background nodeos job to foreground for docker run
fg %1
