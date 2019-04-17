#!/usr/bin/env bash

if [ ! "$(docker ps -q -f name=nodeos-gui)" ]; then
  echo "building nodeos-gui docker"
  docker build -t eosio/nodeos-gui ..
else
  echo "nodeos-gui docker already running"
  echo "stopping nodeos-gui docker"
  docker stop nodeos-gui
  echo "building nodeos-gui docker"
  docker build -t eosio/nodeos-gui ..
fi
