#!/usr/bin/env bash

# sourcing variable from config file
source ./config.file

RED='\033[0;31m'
NC='\033[0m' # No Color
GREEN='\033[0;32m'

SCRIPTPATH="$( pwd -P )"
EOSDOCKER="$SCRIPTPATH/packages/docker-eosio-nodeos"
MONGODOCKER="$SCRIPTPATH/packages/docker-mongodb"
COMPILER="$SCRIPTPATH/packages/api-eosio-compiler"
GUI="$SCRIPTPATH/packages/ui-gui-nodeos"
ISDEV=false

for arg in $@
do
    case $arg in
      -d|--delete)
        ./remove_dockers.sh
        ;;
      -dev|--develop)
        ISDEV=true
        ;;
  esac
done

echo " "
echo "=============================="
echo "STARTING MONGODB DOCKER"
echo "=============================="
if [ "$(docker ps -q -f status=paused -f name=$MONGODB_CONTAINER_NAME)" ]; then
  echo 'resuming mongodb docker'
  docker unpause $MONGODB_CONTAINER_NAME
else
  if [ ! "$(docker ps -q -f name=$MONGODB_CONTAINER_NAME)" ]; then
    if find "$MONGODOCKER/data" -mindepth 1 -print -quit 2>/dev/null | grep -q .; then
        echo "mongodb docker is not running, but data folder exists"
        echo "cleaning data now"
        rm -r $MONGODOCKER/data/*
        sleep 10 #else docker fails  sometimes
    fi
  fi
  (cd $MONGODOCKER && ./start_mongodb_docker.sh && printf "${GREEN}done${NC}")
fi

echo " "
echo "=============================="
echo "STARTING EOSIO DOCKER"
echo "=============================="
if [ "$(docker ps -q -f status=paused -f name=eosio_gui_nodeos_container)" ]; then
  echo 'resuming eosio docker'
  docker unpause eosio_gui_nodeos_container
else
  if [ ! "$(docker ps -q -f name=eosio_gui_nodeos_container)" ]; then
    if find "$EOSDOCKER/data" -mindepth 1 -print -quit 2>/dev/null | grep -q .; then
        echo "eosio docker is not running, but data folder exists"
        echo "cleaning data now"
        rm -r $EOSDOCKER/data/*
        sleep 10 #else docker fails  sometimes
    fi
  fi
  (cd $EOSDOCKER && ./start_eosio_docker.sh --nolog && printf "${GREEN}done${NC}")
fi

# start compiler service in background
echo " "
echo "=============================="
echo "STARTING COMPILER SERVICE"
echo "=============================="
(cd $COMPILER && yarn start > compiler.log &)

# wait until eosio blockchain to be started
waitcounter=0
until $(curl --output /dev/null \
             --silent \
             --head \
             --fail \
             localhost:8888/v1/chain/get_info)
do
  if [[ "$waitcounter" -lt 6 ]]; then
    echo " "
    echo "$((waitcounter+1)) - Waiting for dockers to be started..."
    sleep 10s
    waitcounter=$((waitcounter+1))
  else
    echo " "
    echo "Problem starting docker, removing dockers and restarting"
    ./remove_dockers.sh
    echo " "
    echo "Restarting eosio docker"
    ./quick_start.sh
    exit 0
  fi
done

echo " "
echo "=============================="
echo "STARTING GUI"
echo "=============================="

# $2 should be either argument "--first-time-setup" or null
if $ISDEV; then
  ./start_gui.sh -dev $2
else
  ./start_gui.sh $2
fi

P1=$!

# wait $P1
wait $P1
