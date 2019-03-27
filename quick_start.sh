#!/usr/bin/env bash

RED='\033[0;31m'
NC='\033[0m' # No Color
GREEN='\033[0;32m'

SCRIPTPATH="$( pwd -P )"
EOSDOCKER="$SCRIPTPATH/packages/docker-eosio-nodeos"
MONGODOCKER="$SCRIPTPATH/packages/docker-mongodb"
MONGOAPI="$SCRIPTPATH/packages/api-mongodb-plugin"
RPCAPI="$SCRIPTPATH/packages/api-rpc"
GUI="$SCRIPTPATH/packages/ui-gui-nodeos"

echo $EXECPATH

# make sure everything is clean and well setup
echo "=============================="
echo "[quick_start.sh] INSTALLING DEPENDENCIES"
echo "=============================="
yarn install

# make sure everything is clean and well setup
echo " "
echo "=============================="
echo "[quick_start.sh] BUILDING DOCKER"
echo "=============================="
(cd $EOSDOCKER && ./first_time_setup.sh && printf "${GREEN}done${NC}")

# echo " "
# echo "=============================="
# echo "[quick_start.sh] REBUILDING MONGODB APIs"
# echo "=============================="
# (cd $MONGOAPI && rm -rf dist && tsc && cd $SCRIPTPATH && printf "${GREEN}done${NC}")

# echo " "
# echo "=============================="
# echo "[quick_start.sh] REBUILDING RPC APIs"
# echo "=============================="
# (cd $RPCAPI && rm -rf dist && tsc && cd $SCRIPTPATH && printf "${GREEN}done${NC}")

# remove existing dockers
echo " "
echo "=============================="
echo "[quick_start.sh] CLEANING EXISTING EOSIO DOCKER"
echo "=============================="
(cd $EOSDOCKER && ./remove_eosio_docker.sh && printf "${GREEN}done${NC}")

echo " "
echo "=============================="
echo "[quick_start.sh] CLEANING EXISTING MONGODB DOCKER"
echo "=============================="
(cd $MONGODOCKER && ./remove_mongodb_docker.sh && printf "${GREEN}done${NC}")

# start blockchain and put in background
echo " "
echo "=============================="
echo "[quick_start.sh] STARTING MONGODB DOCKER"
echo "=============================="
(cd $MONGODOCKER && ./start_mongodb_docker.sh && printf "${GREEN}done${NC}")

echo " "
echo "=============================="
echo "[quick_start.sh] STARTING EOSIO DOCKER"
echo "=============================="
(cd $EOSDOCKER && ./start_eosio_docker.sh --nolog && printf "${GREEN}done${NC}")

# wait until eosio blockchain to be started
until $(curl --output /dev/null \
             --silent \
             --head \
             --fail \
             localhost:8888/v1/chain/get_info)
do
  echo " "
  echo "Waiting for dockers to be started..."
  sleep 10s
done

echo " "
echo "=============================="
echo "[quick_start.sh] Starting gui docker"
echo "=============================="
(cd $GUI && yarn start)

P1=$!

# wait $P1
wait $P1
