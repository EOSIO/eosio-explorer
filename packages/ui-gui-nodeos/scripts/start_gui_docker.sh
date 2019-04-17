#!/usr/bin/env bash

script="./start_gui.sh"

for arg in $@
do
    case $arg in
      --first-time-setup)
        script="./build_and_start_gui.sh"
        ;;
  esac
done

echo " "
echo "=============================="
echo "STARTING GUI DOCKER"
echo "=============================="

if [ "$1" == "-s" -o "$1" == "--stop" ]; then
  echo "stopping nodeos-gui docker"
  docker stop nodeos-gui 
fi

if [ ! "$(docker ps -q -f name=nodeos-gui)" ]; then
  #if the docker is not running it loses the build folder 
  script="./build_and_start_gui.sh"
  docker run --rm --name nodeos-gui \
    --link eosio-mongodb \
    --link eosio_gui_nodeos_container \
    -p 5000:5000 \
    -i eosio/nodeos-gui \
    "$script"
else
  echo "nodeos-gui docker already running"
  echo "copy and paste this url in browser to start http://localhost:5000"
fi
