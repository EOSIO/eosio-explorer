#!/usr/bin/env bash
set -o errexit

# change to script's directory
cd "$(dirname "$0")"

# sourcing variable from config file
source ./config.file

# override config if there are any local config changes
if [ -f "./config.file.local" ]; then
  source ./config.file.local
fi

if [ "$(docker ps -q -f name=$MONGODB_CONTAINER_NAME)" ]; then
  docker stop $MONGODB_CONTAINER_NAME && rm -rf data && mkdir data
fi
