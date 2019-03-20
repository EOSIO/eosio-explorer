#!/usr/bin/env bash
set -o errexit

# set PATH
PATH="$PATH:/opt/eosio/bin"

CONTRACTSPATH="$( pwd -P )/contracts"
COMPILEDCONTRACTSPATH="$( pwd -P )/compiled_contracts"
CONTRACTFILE=$(basename -- "$1")
EXTENSION="${CONTRACTFILE##*.}"
CONTRACTNAME="${CONTRACTFILE%.*}"
FULLFILEPATH=$1

# make new directory for compiled contract files
# WASM and ABI
rm -rf ./compiled_contracts
mkdir -p ./compiled_contracts
mkdir -p ./compiled_contracts/$CONTRACTNAME

# compile smart contract source files to WASM and ABI files using EOSIO.CDT
if [ "$#" -eq 1 ]; then
    (
        eosio-cpp -abigen "$CONTRACTSPATH/$FULLFILEPATH" -o "$COMPILEDCONTRACTSPATH/$CONTRACTNAME/$CONTRACTNAME.wasm" -contract "$CONTRACTNAME" 
    ) 
fi

if [ "$#" -ge 2 ]; then
    shift 1
    (
        eosio-cpp -abigen "$CONTRACTSPATH/$FULLFILEPATH" -o "$COMPILEDCONTRACTSPATH/$CONTRACTNAME/$CONTRACTNAME.wasm" -contract "$CONTRACTNAME" -I=$@
    ) 
fi
