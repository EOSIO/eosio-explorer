#!/usr/bin/env bash

RED='\033[0;31m'
NC='\033[0m' # No Color
GREEN='\033[0;32m'

SCRIPTPATH="$( pwd -P )"
EOSDOCKER="$SCRIPTPATH/packages/docker-eosio-nodeos"
MONGODOCKER="$SCRIPTPATH/packages/docker-mongodb"
COMPILER="$SCRIPTPATH/packages/api-eosio-compiler/docker-eosio-cdt"
GUI="$SCRIPTPATH/packages/ui-gui-nodeos"

# make sure everything is clean and well setup
echo "=============================="
echo "INSTALLING DEPENDENCIES"
echo "=============================="
yarn install

# make sure everything is clean and well setup
echo " "
echo "=============================="
echo "BUILDING EOSIO DOCKER"
echo "=============================="
(cd $EOSDOCKER && ./build_eosio_docker.sh && printf "${GREEN}done${NC}")

# make sure everything is clean and well setup
echo " "
echo "=============================="
echo "BUILDING COMPILER DOCKER"
echo "=============================="
(cd $COMPILER && ./build_eosio_cdt_docker.sh && printf "${GREEN}done${NC}")

# make sure everything is clean and well setup
echo " "
echo "=============================="
echo "BUILDING APPLICATION"
echo "=============================="
(cd $GUI && yarn build && printf "${GREEN}done${NC}")

# echo 'build done'
# remove existing dockers 
./remove_dockers.sh

# starting the dockers and gui
./quick_start.sh

P1=$!

# wait $P1
wait $P1
