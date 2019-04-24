#!/usr/bin/env bash

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

if [ -e "data/initialized" ]
then
    script="./scripts/continue_blockchain.sh"
else
    script="./scripts/init_blockchain.sh"
fi

if [ ! "$(docker ps -q -f name=$NODEOS_CONTAINER_NAME)" ]; then
    if [ "$(docker volume ls --format '{{.Name}}' -f name=$NODEOS_VOLUME_NAME)" ]; then
      echo "eosio docker is not running, but eosio volume exists"
      echo "cleaning data now"
      docker volume rm --force $NODEOS_VOLUME_NAME
      sleep 10
    fi

    docker volume create --name=$NODEOS_VOLUME_NAME
    # --link is to get access to other container
    echo "run docker container from the $NODEOS_IMAGE_NAME image"
    docker run --rm --name $NODEOS_CONTAINER_NAME -d \
    -p 8888:8888 -p 9876:9876 \
    --link $MONGODB_CONTAINER_NAME \
    -v $NODEOS_VOLUME_NAME:/mnt/dev/data \
    $NODEOS_IMAGE_NAME \
    "$script"

    if [ "$1" != "--nolog" ]
    then
        echo "=== follow $NODEOS_CONTAINER_NAME logs ==="
        docker logs $NODEOS_CONTAINER_NAME --follow
    fi
else
    echo "docker already running"
fi
