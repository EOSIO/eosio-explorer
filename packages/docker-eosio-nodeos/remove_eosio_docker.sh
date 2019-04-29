#!/usr/bin/env bash
set -o errexit

# sourcing variable from config file
source ./config.file

# override config if there are any local config changes
if [ -f "./config.file.local" ]; then
  source ./config.file.local
fi

# change to script's directory
cd "$(dirname "$0")"
# stop the container if the container is running
if [ "$(docker ps -q -f name=^$NODEOS_CONTAINER_NAME$)" ]; then
  docker stop $NODEOS_CONTAINER_NAME
  sleep 10
fi
# also remove blockchain volume if its exists
if [ "$(docker volume ls --format '{{.Name}}' -f name=^$NODEOS_VOLUME_NAME$)" ]; then
    docker volume rm --force $NODEOS_VOLUME_NAME
fi
