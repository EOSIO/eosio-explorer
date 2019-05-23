#!/usr/bin/env bash
set -o errexit

# cd into current directory
cd $( dirname "$0" )

# App root directory is one level upper
APP=$(dirname "$( pwd -P )")

# sourcing variable from config file
source $APP/config.file

# override config if there are any local config changes
if [ -f "$APP/config.file.local" ]; then
  source $APP/config.file.local
fi

USAGE="Usage: eosio-explorer stop_dockers (Stop any currently running Docker containers gracefully)"

# check for arguments
for arg in $@
do
  case $arg in
    -h|--help)
      echo "$USAGE"
      exit
      ;;
    *) 
      printf "illegal option: %s\n" "$arg" >&2
      echo "$USAGE" >&2
      exit 1
      ;;
  esac
done

echo " "
echo "=============================="
echo "STOPPING EOSIO DOCKER"
echo "=============================="
# Check if the Docker container is running
if [ "$(docker ps -q -f status=running -f name=^$NODEOS_CONTAINER_NAME$)" ]; then
    docker exec -i $NODEOS_CONTAINER_NAME ./scripts/stop_blockchain.sh
else
    echo "eosio docker is not running"
fi


echo " "
echo "=============================="
echo "STOPPING CDT DOCKER"
echo "=============================="
# Check if the Docker container is running
if [ "$(docker ps -aq -f status=running -f name=^$CDT_CONTAINER_NAME$)" ]; then
    docker stop $CDT_CONTAINER_NAME
else
    echo "cdt docker is not running"
fi


echo " "
echo "=============================="
echo "STOPPING MONGODB DOCKER"
echo "=============================="
# Check if the Docker container is running
if [ "$(docker ps -aq -f status=running -f name=^$MONGODB_CONTAINER_NAME$)" ]; then
    docker stop $MONGODB_CONTAINER_NAME
else
    echo "mongodb docker is not running"
fi
