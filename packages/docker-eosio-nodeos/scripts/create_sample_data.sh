#!/usr/bin/env bash
set -o errexit

echo "creating sample accounts and performing test transactions"

# set PATH
PATH="$PATH:/opt/eosio/bin:/opt/eosio/bin/scripts"

echo "1. creating wallet: hellowal"
## key for eosio account and export the generated password to a file for unlocking wallet later
cleos wallet create -n hellowal --to-console | tail -1 | sed -e 's/^"//' -e 's/"$//' > hello_wallet_password.txt
## Owner key for hellowal wallet
cleos wallet import -n hellowal --private-key 5JrDP7knfwybgxbVbmWVqmNtexindWpAeVs2divw7WDiLyjkDJU
# # Active key for hellowal wallet
cleos wallet import -n hellowal --private-key 5JEb8Qzy6ZTfs9mGdKKSZL1GB4Lxbj3uPnWFbm652GS9RQQHmHa

# # create account for helloacc with above wallet's public keys
cleos create account eosio helloacc EOS8mQ4RVYYsNXfpPCiJew4FxEo3viBTEaTgPtdHXKceMdNvqmTzK EOS71ndY36kez1mWzTX4XRf7FK4TpPYKmN9Q1BPW9LBGR9LyKSTb1

echo "2. creating wallet: notewal"
## key for eosio account and export the generated password to a file for unlocking wallet later
cleos wallet create -n notewal --to-console | tail -1 | sed -e 's/^"//' -e 's/"$//' > note_wallet_password.txt
## Owner key for notewal wallet
cleos wallet import -n notewal --private-key 5HprNJsGzQajAMGiEzyHmy8rW8M4TMM3to1kEPWexch5vJJNxJX
# # Active key for notewal wallet
cleos wallet import -n notewal --private-key 5HpYaJpP16dJLDgDEeY5n5GFaDjL1TwTVo6KrdWQWSjQpK1a4AT

# # create account for noteacc with above wallet's public keys
cleos create account eosio noteacc EOS57cp4Joru7pnUzLg8RtHLWYWwjgBza9jPncE3ovbMSGN2MyZGa EOS6pwXEFGVYnX6zmozNAo9MRgkJrfP24x46Pek8dHjpAFGWS7had

echo "3. deploying smart contract"
# $1 smart contract name
# $2 account holder name of the smart contract
# $3 wallet for unlock the account
# $4 password for unlocking the wallet
# $5 to deploy?
deploy_contract.sh helloworld helloacc hellowal $(cat hello_wallet_password.txt) true
deploy_contract.sh testnote noteacc notewal $(cat note_wallet_password.txt) true

echo "4. creating user accounts"
# script to create test accounts into blockchain
create_accounts.sh

echo "5. sending test transactions"
# script to create test transactions into blockchain
cleos push action helloacc sendmsg '["msg1"]' -p helloacc@active
sleep 10
cleos push action helloacc sendmsg '["msg2"]' -p helloacc@active
cleos push action helloacc sendmsg '["msg3"]' -p helloacc@active
sleep 10
cleos push action helloacc sendmsg '["msg4"]' -p helloacc@active
cleos push action helloacc sendmsg '["msg5"]' -p helloacc@active
cleos push action helloacc sendmsg '["msg6"]' -p helloacc@active

echo "6. sending test transactions with multi index table"
# script to create some more test transactions into blockchain
cleos push action noteacc update '["noteacc", "this is test note"]' -p noteacc@active
cleos push action noteacc update '["useraaaaaaaa", "this is from useraaaaaaaa note"]' -p useraaaaaaaa@active
cleos push action noteacc update '["useraaaaaaab", "this is from useraaaaaaab note"]' -p useraaaaaaab@active
cleos push action noteacc update '["useraaaaaaac", "this is from useraaaaaaac note"]' -p useraaaaaaac@active
cleos push action noteacc update '["useraaaaaaad", "this is from useraaaaaaad note"]' -p useraaaaaaad@active
