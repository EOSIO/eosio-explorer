#!/usr/bin/env bash

RED='\033[0;31m'
NC='\033[0m' # No Color
GREEN='\033[0;32m'

SCRIPTPATH="$( pwd -P )"
EOSDOCKER="$SCRIPTPATH/packages/docker-eosio-nodeos"
MONGODOCKER="$SCRIPTPATH/packages/docker-mongodb"
COMPILER="$SCRIPTPATH/packages/api-eosio-compiler"
GUI="$SCRIPTPATH/packages/ui-gui-nodeos"

if [ "$1" == "-d" -o "$1" == "--delete" ]; then
  ./remove_dockers.sh
fi

# start blockchain and put in background
echo " "
echo "=============================="
echo "STARTING MONGODB DOCKER"
echo "=============================="
(cd $MONGODOCKER && ./start_mongodb_docker.sh && printf "${GREEN}done${NC}")

echo " "
echo "=============================="
echo "STARTING EOSIO DOCKER"
echo "=============================="
(cd $EOSDOCKER && ./start_eosio_docker.sh --nolog && printf "${GREEN}done${NC}")

# start compiler service in background
echo " "
echo "=============================="
echo "STARTING CONTRACT COMPILER SERVICE"
echo "=============================="
(cd $COMPILER && yarn start > compiler.log && printf "${GREEN}done${NC}")

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
# (cd $GUI && yarn start)

P1=$!

# wait $P1
wait $P1
