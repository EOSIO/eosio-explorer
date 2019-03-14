#!/usr/bin/env bash
set -o errexit

# set PATH
PATH="$PATH:/opt/eosio/bin"

CONTRACTSPATH="$( pwd -P )/contracts"

# make new directory for compiled contract files
# WASM and ABI

mkdir -p ./compiled_contracts
mkdir -p ./compiled_contracts/$1

COMPILEDCONTRACTSPATH="$( pwd -P )/compiled_contracts"
CONTRACTNAME=$(basename -- "$1")

# compile smart contract source files to WASM and ABI files using EOSIO.CDT
(
    eosio-cpp -abigen "$CONTRACTSPATH/$1.cpp" -o "$COMPILEDCONTRACTSPATH/$CONTRACTNAME/$CONTRACTNAME.wasm" --contract "$1"
) 
