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

echo "=== run docker container from the $CDT_IMAGE_NAME image ==="
# -d: Detach docker container, let it run in background
# --name: Assign name to the container
# --mount: Mount filesystem from host to container.
# -w: Enforce working directory inside the container.
docker run -i --name $CDT_CONTAINER_NAME -d \
-v /"$(pwd)"/contracts:/opt/eosio/bin/contracts \
-v /"$(pwd)"/scripts:/opt/eosio/bin/scripts \
$CDT_IMAGE_NAME
