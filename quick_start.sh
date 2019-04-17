#!/usr/bin/env bash

# sourcing variable from config file
source ./config.file

# override config if there are any local config changes
if [ -f "./config.file.local" ]; then
  source ./config.file.local
fi

RED='\033[0;31m'
NC='\033[0m' # No Color
GREEN='\033[0;32m'

SCRIPTPATH="$( pwd -P )"
EOSDOCKER="$SCRIPTPATH/packages/docker-eosio-nodeos"
MONGODOCKER="$SCRIPTPATH/packages/docker-mongodb"
COMPILER="$SCRIPTPATH/packages/api-eosio-compiler"
GUI="$SCRIPTPATH/packages/ui-gui-nodeos"

ISDEV=false
ISDELETE=false
ISFIRSTTIMESETUP=false

for arg in $@
do
    case $arg in
      -d|--delete)
        ./remove_dockers.sh
        ISDELETE=true
        ;;
      -dev|--develop)
        ISDEV=true
        ;;
      --first-time-setup)
        ISFIRSTTIMESETUP=true
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
    if [ "$(docker volume ls --format '{{.Name}}' -f name=$MONGODB_VOLUME_NAME)" ]; then
        echo "mongodb docker is not running, but mongodb volume exists"
        echo "cleaning data now"
        docker volume rm --force $MONGODB_VOLUME_NAME
        sleep 10 #else docker fails  sometime
    fi
  fi
  (cd $MONGODOCKER && ./start_mongodb_docker.sh && printf "${GREEN}done${NC}")
fi

echo " "
echo "=============================="
echo "STARTING EOSIO DOCKER"
echo "=============================="
if [ "$(docker ps -q -f status=paused -f name=$NODEOS_CONTAINER_NAME)" ]; then
  echo 'resuming eosio docker'
  docker unpause $NODEOS_CONTAINER_NAME
else
  if [ ! "$(docker ps -q -f name=$NODEOS_CONTAINER_NAME)" ]; then
    if find "$EOSDOCKER/data" -mindepth 1 -print -quit 2>/dev/null | grep -q .; then
        echo "eosio docker is not running, but data folder exists"
        echo "cleaning data now"
        rm -r $EOSDOCKER/data/*
        sleep 10 #else docker fails  sometimes
    fi
  fi
  (cd $EOSDOCKER && ./start_eosio_docker.sh --nolog && printf "${GREEN}done${NC}")
fi

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

# If it is ./quick_start.sh with -d or from first time setup, clear the browser storage by adding a new timestamp when start CRA dev.
if $ISDEV; then
  if ($ISDELETE || $ISFIRSTTIMESETUP); then
    (cd $GUI/scripts/ && ./start_gui_docker.sh -dev --clear-browser-storage)
  else
    (cd $GUI/scripts/ && ./start_gui_docker.sh -dev)
  fi
else
  if ($ISDELETE || $ISFIRSTTIMESETUP); then
    (cd $GUI/scripts/ && ./start_gui_docker.sh --clear-browser-storage)
  else
    # It will start a serve which already build with a new timestamp
    (cd $GUI/scripts/ && ./start_gui_docker.sh)
  fi
fi

P1=$!

# wait $P1
wait $P1
