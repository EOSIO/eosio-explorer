#!/usr/bin/env bash

# sourcing variable from config file
source ./config.file

# override config if there are any local config changes
if [ -f "./config.file.local" ]; then
  source ./config.file.local
fi

if [ ! "$(docker ps -q -f name=$UI_CONTAINER_NAME)" ]; then
  echo "building $UI_CONTAINER_NAME docker"
  docker build -t eosio/$UI_CONTAINER_NAME ../../..
else
  echo "$UI_CONTAINER_NAME docker already running"
  echo "stopping $UI_CONTAINER_NAME docker"
  docker stop $UI_CONTAINER_NAME
  echo "building $UI_CONTAINER_NAME docker"
  docker build -t eosio/$UI_CONTAINER_NAME ../../..
fi
