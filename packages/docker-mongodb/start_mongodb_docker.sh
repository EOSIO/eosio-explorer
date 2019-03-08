#!/usr/bin/env bash
set -o errexit

# change to script's directory
cd "$(dirname "$0")"

docker run -d -p 27017:27017 --name eosio-mongodb -v $(pwd)/data:/data/db mongo
