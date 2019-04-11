#!/usr/bin/env bash

RED='\033[0;31m'
NC='\033[0m' # No Color
GREEN='\033[0;32m'

SCRIPTPATH="$( pwd -P )"
EOSDOCKER="$SCRIPTPATH/packages/docker-eosio-nodeos"
MONGODOCKER="$SCRIPTPATH/packages/docker-mongodb"
COMPILER="$SCRIPTPATH/packages/api-eosio-compiler/docker-eosio-cdt"
GUI="$SCRIPTPATH/packages/ui-gui-nodeos"
ISDEV=false

if [ "$1" == "-dev" -o "$1" == "--develop" ]; then
  ISDEV=true
fi

echo "=============================="
echo "INSTALLING DEPENDENCIES"
echo "=============================="
yarn install

echo " "
echo "=============================="
echo "BUILDING EOSIO DOCKER"
echo "=============================="
(cd $EOSDOCKER && ./build_eosio_docker.sh && printf "${GREEN}done${NC}")

echo " "
echo "=============================="
echo "BUILDING EOSIO_CDT DOCKER USED BY COMPILER SERVICE"
echo "=============================="
(cd $COMPILER && ./build_eosio_cdt_docker.sh && printf "${GREEN}done${NC}")

if !($ISDEV); then
# create a static build of application for production
echo " "
echo "=============================="
echo "BUILDING APPLICATION"
echo "=============================="

# Set environment variable "LAST_FIRST_TIME_SETUP_TIMESTAMP" at build time to create a new timestamp while serving the app.
(cd $GUI && REACT_APP_LAST_FIRST_TIME_SETUP_TIMESTAMP=$(date +%s) yarn build && printf "${GREEN}done${NC}")
fi

# remove existing dockers
./remove_dockers.sh

./quick_start.sh $1 --first-time-setup

P1=$!

# wait $P1
wait $P1
