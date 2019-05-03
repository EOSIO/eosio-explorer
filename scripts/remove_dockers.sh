#!/usr/bin/env bash
set -o errexit

# cd into current directory
cd $( dirname "$0" )

RED='\033[0;31m'
NC='\033[0m' # No Color
GREEN='\033[0;32m'

SCRIPTPATH="$( pwd -P )/../.."
EOSDOCKER="$SCRIPTPATH/docker-eosio-nodeos"
MONGODOCKER="$SCRIPTPATH/docker-mongodb"
COMPILER="$SCRIPTPATH/api-eosio-compiler/docker-eosio-cdt"

# remove existing dockers
echo " "
echo "=============================="
echo "CLEANING EXISTING EOSIO DOCKER"
echo "=============================="
(cd $EOSDOCKER && ./remove_eosio_docker.sh && printf "${GREEN}done${NC}")

echo " "
echo "=============================="
echo "CLEANING EXISTING MONGODB DOCKER"
echo "=============================="
(cd $MONGODOCKER && ./remove_mongodb_docker.sh && printf "${GREEN}done${NC}")

echo " "
echo "=============================="
echo "CLEANING EXISTING CDT DOCKER"
echo "=============================="
(cd $COMPILER && ./remove_eosio_cdt_docker.sh && printf "${GREEN}done${NC}")
