#!/usr/bin/env bash
set -o errexit

# change to script's directory
cd "$(dirname "$0")"

# sourcing variable from config file
source ./config.file

if [ "$(docker ps -q -f name=$MONGODB_CONTAINER_NAME)" ]; then
  docker stop $MONGODB_CONTAINER_NAME && rm -rf data && mkdir data
fi
