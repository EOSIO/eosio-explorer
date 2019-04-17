#!/usr/bin/env bash

# sourcing variable from config file
source ./config.file

# override config if there are any local config changes
if [ -f "./config.file.local" ]; then
  source ./config.file.local
fi

script="./packages/ui-gui-nodeos/scripts/start_gui.sh"

for arg in $@
do
    case $arg in
      --clear-browser-storage)
        script="./packages/ui-gui-nodeos/scripts/build_and_start_gui.sh"
        ;;
  esac
done

echo " "
echo "=============================="
echo "STARTING GUI DOCKER"
echo "=============================="

if [ "$1" == "-s" -o "$1" == "--stop" ]; then
  echo "stopping $UI_CONTAINER_NAME docker"
  docker stop $UI_CONTAINER_NAME 
fi

if [ ! "$(docker ps -q -f name=$UI_CONTAINER_NAME)" ]; then
  #if the docker is not running it loses the build folder 
  script="./packages/ui-gui-nodeos/scripts/build_and_start_gui.sh"
  docker run --rm --name $UI_CONTAINER_NAME \
    --link $MONGODB_CONTAINER_NAME \
    --link $NODEOS_CONTAINER_NAME \
    -p 5000:5000 \
    -i eosio/$UI_CONTAINER_NAME \
    "$script"
else
  echo "$UI_CONTAINER_NAME docker is already running"
  echo "copy and paste this url in browser to start http://localhost:5000"
fi
