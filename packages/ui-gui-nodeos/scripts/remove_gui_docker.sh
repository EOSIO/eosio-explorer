#!/usr/bin/env bash

# sourcing variable from config file
source ./config.file

# override config if there are any local config changes
if [ -f "./config.file.local" ]; then
  source ./config.file.local
fi

if [ "$(docker ps -q -f name=$UI_CONTAINER_NAME)" ]; then
  (docker stop $UI_CONTAINER_NAME && printf "${GREEN}done${NC}")
  echo " "
fi
