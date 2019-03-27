#!/usr/bin/env bash

RED='\033[0;31m'
NC='\033[0m' # No Color
GREEN='\033[0;32m'

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
./packages/docker-eosio-nodeos/first_time_setup.sh
printf "${GREEN}done${NC}"

echo " "
echo "=============================="
echo "[quick_start.sh] REBUILDING MONGODB APIs"
echo "=============================="
cd packages/api-mongodb-plugin && rm -rf dist && tsc && cd ../..
printf "${GREEN}done${NC}"

echo " "
echo "=============================="
echo "[quick_start.sh] REBUILDING RPC APIs"
echo "=============================="
cd packages/api-rpc && rm -rf dist && tsc && cd ../..
printf "${GREEN}done${NC}"

# remove existing dockers
echo " "
echo "=============================="
echo "[quick_start.sh] CLEANING EXISTING EOSIO DOCKER"
echo "=============================="
./packages/docker-eosio-nodeos/remove_eosio_docker.sh 
printf "${GREEN}done${NC}"

echo " "
echo "=============================="
echo "[quick_start.sh] CLEANING EXISTING MONGODB DOCKER"
echo "=============================="
./packages/docker-mongodb/remove_mongodb_docker.sh 
printf "${GREEN}done${NC}"

# start blockchain and put in background
echo " "
echo "=============================="
echo "[quick_start.sh] STARTING MONGODB DOCKER"
echo "=============================="
./packages/docker-mongodb/start_mongodb_docker.sh 
printf "${GREEN}done${NC}"

echo " "
echo "=============================="
echo "[quick_start.sh] STARTING EOSIO DOCKER"
echo "=============================="
./packages/docker-eosio-nodeos/start_eosio_docker.sh --nolog
printf "${GREEN}done${NC}"

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
cd packages/ui-gui-nodeos/ && yarn start

P1=$!

# wait $P1
wait $P1
