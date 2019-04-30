#!/usr/bin/env bash

echo "start building eosio docker"

# change to script's directory
cd "$(dirname "$0")"
SCRIPTPATH="$( pwd -P )"

# sourcing variable from config file
source ./config.file

# override config if there are any local config changes
if [ -f "./config.file.local" ]; then
  source ./config.file.local
fi

# make sure Docker and Node.js is installed
if [ ! -x "$(command -v docker)" ] ||
   [ ! -x "$(command -v npm)" ]; then
  echo ""
  echo -e "\033[0;31m[Error with Exception]\033[0m"
  echo "Please make sure Docker and Node.js are installed"
  echo ""
  echo "Install Docker: https://docs.docker.com/docker-for-mac/install/"
  echo "Install Node.js: https://nodejs.org/en/"
  echo ""
  exit
fi

# build docker image, if necessary
if [[ "$(docker images -q $NODEOS_IMAGE_NAME)" == "" ]]; then
  echo "Build docker image $NODEOS_IMAGE_PREFIX version $NODEOS_VERSION, this may take some time"
  docker build -t $NODEOS_IMAGE_NAME . --no-cache
else
  echo "docker image already exists, skip building"
fi

# force remove the perivous container if any
# create a clean data folder in eosio_docker to preserve block data
echo "cleaning up data remnants"
echo "remove the volume if the container doesn't exists"
if [ "$(docker ps -q -f name=^$NODEOS_CONTAINER_NAME$)" ]; then
    if [ "$(docker ps -aq -f status=running -f name=^$NODEOS_CONTAINER_NAME$)" ]; then
        echo "Previous container is running, stopping"
        docker rm --force $NODEOS_CONTAINER_NAME
    fi
fi
if [ ! "$(docker ps -q -f name=^$NODEOS_CONTAINER_NAME$)" ]; then
  echo "No container running"
fi
echo "Re-initializing block log folder"
rm -rf "./data"
mkdir -p "./data"
