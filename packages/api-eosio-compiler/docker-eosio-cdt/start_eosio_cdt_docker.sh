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

if [ ! "$(docker ps -q -f name=^$CDT_CONTAINER_NAME$)" ]; then
  echo "starting docker container from the $CDT_IMAGE_NAME image"
  # -d: Detach docker container, let it run in background
  # --name: Assign name to the container
  # --mount: Mount filesystem from host to container.
  # -w: Enforce working directory inside the container.
  docker run --rm -i --name $CDT_CONTAINER_NAME -d \
  $CDT_IMAGE_NAME
else
  echo "docker is already running"
fi
