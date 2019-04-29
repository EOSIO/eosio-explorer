#!/usr/bin/env bash

echo "starting eosio-cdt docker setup"

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
 docker build -t $CDT_IMAGE_NAME .
# build docker image, if necessary
if [[ "$(docker images -q $CDT_IMAGE_NAME)" == "" ]]; then
  echo "building docker image $CDT_IMAGE_PREFIX version $CDT_VERSION, this may take some time"
  docker build -t $CDT_IMAGE_NAME . --no-cache
else
  echo "docker image already exists, skip building"
fi
