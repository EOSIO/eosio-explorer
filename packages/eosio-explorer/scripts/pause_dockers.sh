#!/usr/bin/env bash
set -o errexit

# cd into current directory
cd $( dirname "$0" )

# sourcing variable from config file
source ../config.file

# override config if there are any local config changes
if [ -f "../config.file.local" ]; then
  source ../config.file.local
fi

echo " "
echo "=============================="
echo "PAUSING EOSIO DOCKER"
echo "=============================="
# Check if the Docker container is running
if [ "$(docker ps -q -f name=$NODEOS_CONTAINER_NAME)" ]; then
    if [ "$(docker ps -aq -f status=running -f name=$NODEOS_CONTAINER_NAME)" ]; then
        docker pause $NODEOS_CONTAINER_NAME
    else
        echo "eosio docker is not running"
    fi
fi

echo " "
echo "=============================="
echo "PAUSING CDT DOCKER"
echo "=============================="
# Check if the Docker container is running
if [ "$(docker ps -aq -f name=$CDT_CONTAINER_NAME)" ]; then
    if [ "$(docker ps -aq -f status=running -f name=$CDT_CONTAINER_NAME)" ]; then
        docker pause $CDT_CONTAINER_NAME
    else
        echo "cdt docker is not running"
    fi
fi

echo " "
echo "=============================="
echo "PAUSING MONGODB DOCKER"
echo "=============================="
# Check if the Docker container is running
if [ "$(docker ps -aq -f name=$MONGODB_CONTAINER_NAME)" ]; then
    if [ "$(docker ps -aq -f status=running -f name=$MONGODB_CONTAINER_NAME)" ]; then
        docker pause $MONGODB_CONTAINER_NAME
    else
        echo "mongodb docker is not running"
    fi
fi
