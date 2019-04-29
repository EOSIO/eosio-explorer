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

# check if mongodb container is running
if [ "$(docker ps -q -f name=$MONGODB_CONTAINER_NAME)" ]; then
  docker stop $MONGODB_CONTAINER_NAME 
  echo "waiting for docker to stop"
  sleep 10s
else
  echo "mongodb docker is not running"  
fi

#remove docker volume
if [ "$(docker volume ls --format '{{.Name}}' -f name=$MONGODB_VOLUME_NAME)" ]; then
    docker volume rm --force $MONGODB_VOLUME_NAME
fi
