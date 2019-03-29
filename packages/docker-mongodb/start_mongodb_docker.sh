#!/usr/bin/env bash
set -o errexit

# change to script's directory
cd "$(dirname "$0")"

# docker did not stop properly
if [ "$(docker ps -q -f status=exited -f name=eosio-mongodb)" ]; then
  docker rm eosio-mongodb
fi

if [ ! "$(docker ps -q -f name=eosio-mongodb)" ]; then
  docker run -d --rm -p 27017:27017 --name eosio-mongodb -v $(pwd)/data:/data/db mongo
else
  echo "docker already running"
fi
