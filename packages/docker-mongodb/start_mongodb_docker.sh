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

# docker did not stop properly
if [ "$(docker ps -q -f status=exited -f name=$MONGODB_CONTAINER_NAME)" ]; then
  docker rm $MONGODB_CONTAINER_NAME
fi

if [ ! "$(docker ps -q -f name=$MONGODB_CONTAINER_NAME)" ]; then
  if find "$(pwd)/data" -mindepth 1 -print -quit 2>/dev/null | grep -q .; then
    echo "mongodb docker is not running, but data folder exists"
    echo "cleaning data now"
    rm -r "$(pwd)"/data/*
    docker volume rm --force $MONGODB_VOLUME_NAME
  fi
  docker volume create --name=$MONGODB_VOLUME_NAME
  docker run -d --rm -p $MONGODB_PORT:$MONGODB_PORT --name $MONGODB_CONTAINER_NAME -v mongodata:/data/db mongo --port $MONGODB_PORT
else
  echo "docker already running"
fi
