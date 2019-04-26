#!/usr/bin/env bash

# cd into current directory
cd $( dirname "$0" )

# sourcing variable from config file
source ../config.file

# override config if there are any local config changes
if [ -f "../config.file.local" ]; then
  source ../config.file.local
fi

RED='\033[0;31m'
NC='\033[0m' # No Color
GREEN='\033[0;32m'

SCRIPTPATH="$( pwd -P )/../.."
EOSDOCKER="$SCRIPTPATH/docker-eosio-nodeos"
MONGODOCKER="$SCRIPTPATH/docker-mongodb"
COMPILER="$SCRIPTPATH/api-eosio-compiler"
GUI="$SCRIPTPATH/ui-gui-nodeos"
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
        echo "mongodb docker is not running, but mongo volume exists"
        echo "removing volume"
        docker volume rm --force $MONGODB_VOLUME_NAME
        sleep 10 #else docker fails  sometimes
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
    if [ "$(docker volume ls --format '{{.Name}}' -f name=$NODEOS_VOLUME_NAME)" ]; then
      echo "eosio docker is not running, but eosio volume exists"
      echo "cleaning data now"
      docker volume rm --force $NODEOS_VOLUME_NAME
      sleep 10
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

# If it is first-time-setup or it is not -dev and -d, build with a new timestamp.
if ( $ISFIRSTTIMESETUP || (!($ISDEV) && $ISDELETE )); then
  # create a static build of application for production
  echo " "
  echo "=============================="
  echo "BUILDING APPLICATION"
  echo "=============================="

  # Set environment variable "LAST_FIRST_TIME_SETUP_TIMESTAMP" at build time to create a new timestamp while serving the app.
  (cd $GUI && REACT_APP_LAST_FIRST_TIME_SETUP_TIMESTAMP=$(date +%s) yarn build && printf "${GREEN}done${NC}")
fi

echo " "
echo "=============================="
echo "STARTING GUI"
echo "=============================="

# If it is ./quick_start.sh with -d or from first time setup, clear the browser storage by adding a new timestamp when start CRA dev.
if $ISDEV; then
  if ($ISDELETE || $ISFIRSTTIMESETUP); then
    ./start_gui.sh -dev --clear-browser-storage
  else
    ./start_gui.sh -dev
  fi
else
  # It will start a serve which already build with a new timestamp
  ./start_gui.sh
fi

P1=$!

# wait $P1
wait $P1
