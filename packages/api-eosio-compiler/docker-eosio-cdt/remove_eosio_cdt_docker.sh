#!/usr/bin/env bash
set -o errexit

# sourcing variable from config file
source ./config.file

# override config if there are any local config changes
if [ -f "./config.file.local" ]; then
  source ./config.file.local
fi

docker rm -fv $CDT_CONTAINER_NAME
