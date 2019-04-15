#!/usr/bin/env bash
set -o errexit

# change to script's directory
cd "$(dirname "$0")"
if [ "$(docker ps -q -f name=$NODEOS_CONTAINER_NAME)" ]; then
  docker stop $NODEOS_CONTAINER_NAME && rm -r data/*
fi
