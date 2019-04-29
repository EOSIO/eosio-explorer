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
if [ "$(docker ps -q -f status=exited -f name=$NODEOS_CONTAINER_NAME)" ]; then
  docker rm $NODEOS_CONTAINER_NAME
fi

# check if blockchain has been already been initialized/started previously
if [ -e "data/initialized" ]
then
    script="./scripts/continue_blockchain.sh"
else
    script="./scripts/init_blockchain.sh"
fi

# check if container does not already exists
if [ ! "$(docker ps -q -f name=$NODEOS_CONTAINER_NAME)" ]; then
  # check if blockchain volume exists and remove it 
  if [ "$(docker volume ls --format '{{.Name}}' -f name=$NODEOS_VOLUME_NAME)" ]; then
    echo "eosio docker is not running, but eosio volume exists"
    echo "cleaning data now"
    # remove the volume because docker is not running but the volume exists
    docker volume rm --force $NODEOS_VOLUME_NAME
    sleep 10
  fi

  # recreate fresh volume
  docker volume create --name=$NODEOS_VOLUME_NAME
  # start the blockchain docker
  # --link is to get access to other container
  echo "running docker container from the $NODEOS_IMAGE_NAME image"
  docker run --rm --name $NODEOS_CONTAINER_NAME -d \
  -p 8888:8888 -p 9876:9876 \
  --link $MONGODB_CONTAINER_NAME \
  -v $NODEOS_VOLUME_NAME:/mnt/dev/data \
  $NODEOS_IMAGE_NAME \
  "$script"

  # check if we have follow log
  if [ "$1" != "--nolog" ]
  then
      echo "follow $NODEOS_CONTAINER_NAME logs"
      docker logs $NODEOS_CONTAINER_NAME --follow
  fi
else
    echo "docker is already running"
fi
