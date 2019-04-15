#!/usr/bin/env bash
set -o errexit

# change to script's directory
cd "$(dirname "$0")"

# sourcing variable from config file
source ./config.file

# docker did not stop properly
if [ "$(docker ps -q -f status=exited -f name=$MONGODB_CONTAINER_NAME)" ]; then
  docker rm $MONGODB_CONTAINER_NAME
fi

if [ ! "$(docker ps -q -f name=$MONGODB_CONTAINER_NAME)" ]; then
  if find "$(pwd)/data" -mindepth 1 -print -quit 2>/dev/null | grep -q .; then
    echo "mongodb docker is not running, but data folder exists"
    echo "cleaning data now"
    rm -r "$(pwd)"/data/*
  fi

  docker run -d --rm -p $MONGODB_PORT:$MONGODB_PORT --name $MONGODB_CONTAINER_NAME -v $(pwd)/data:/data/db mongo
else
  echo "docker already running"
fi
