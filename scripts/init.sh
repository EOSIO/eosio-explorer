#!/usr/bin/env bash
set -o errexit

# cd into current directory
cd $( dirname "$0" )

# App root directory is one level upper
APP=$(dirname "$( pwd -P )")

# sourcing variable from config file
source $APP/init_config.file

RED='\033[0;31m'
NC='\033[0m' # No Color
GREEN='\033[0;32m'

PWD=$(pwd -P)
YARN_GLOBAL_DIR=$(yarn global dir)

# If current folder is localed inside yarn global folder, means it is installed globally
if [[ $PWD == $YARN_GLOBAL_DIR* ]]; then
  if [ '@ptb1' == $(basename "$(dirname "$(dirname "$( pwd -P )")")") ]; then

      # yarn added globally with scope, dependencies are installed as siblings directory of one level upper
      DEPENDENCIES_ROOT="$(dirname "$(dirname "$(dirname "$( pwd -P )")")")/$DEPENDENCIES_SCOPE_NAME"
  else

      # yarn added globally, dependencies are installed as siblings directory
      DEPENDENCIES_ROOT="$(dirname "$(dirname "$( pwd -P )")")/$DEPENDENCIES_SCOPE_NAME"
  fi
else

    # yarn installed locally, dependencies are installed under current's project directory
    DEPENDENCIES_ROOT="$(dirname "$( pwd -P )")/node_modules/$DEPENDENCIES_SCOPE_NAME"
fi

EOSDOCKER="$DEPENDENCIES_ROOT/docker-eosio-nodeos"
MONGODOCKER="$DEPENDENCIES_ROOT/docker-mongodb"
LOCALSERVICE="$DEPENDENCIES_ROOT/api-eosio-compiler"
COMPILER="$LOCALSERVICE/docker-eosio-cdt"
ISDEV=false
MAKESAMPLEDATA=false

USAGE="Usage: eosio-explorer init [-dev] [-s] [--server-mode] (program to initialize eosio-explorer)

where:
    -s, --sample-data   Starts the tool with pre-existing sample accounts and smart contracts
    --server-mode       Starts the tool in server-mode, it will start the dockers but not the gui
    Only available in development:
    -dev, --develop     Starts the tool in development mode
    -b, --build         Build gui"

# check for arguments
for arg in $@
do
  case $arg in
    -dev|--develop)
      ISDEV=true
      ;;
    -s|--sample-data)
      MAKESAMPLEDATA=true
      ;;
    --server-mode)
      echo "Running the tool in server mode"
      ;;
    -b|--build)
      echo "Running the tool with building gui"
      ;;
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

echo "=============================="
echo "INITIALISING CONFIG IN PACKAGES"
echo "=============================="

# copy init config into different packages
cp -f $APP/init_config.file $EOSDOCKER/config.file.local
cp -f $APP/init_config.file $EOSDOCKER/scripts/config.file.local
cp -f $APP/init_config.file $MONGODOCKER/config.file.local
cp -f $APP/init_config.file $COMPILER/config.file.local
cp -f $APP/init_config.file $APP/config.file.local

# print init config and save it as .env.local into different packages
echo "REACT_APP_MONGODB_PORT=$MONGODB_PORT" > $APP/.env.local
echo "REACT_APP_MONGODB_DB_NAME=$MONGODB_DB_NAME" >> $APP/.env.local
echo "REACT_APP_LOCAL_SERVICE_PORT=$LOCAL_SERVICE_PORT" >> $APP/.env.local
echo "REACT_APP_APP_SERVE_PORT=$APP_SERVE_PORT" >> $APP/.env.local

echo "LOCAL_SERVICE_PORT=$LOCAL_SERVICE_PORT" > $LOCALSERVICE/.env.local

echo "Copying initial config done."
echo " "

# DO NOT yarn install if the app is installed globally to avoid node modules collision
if [[ !($PWD == $YARN_GLOBAL_DIR*) ]]; then
  echo "=============================="
  echo "INSTALLING DEPENDENCIES"
  echo "=============================="
  yarn install
fi

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

# remove existing dockers
./remove_dockers.sh

# start the dockers and gui
./start.sh $@ --clear-browser-storage

P1=$!

# wait $P1
wait $P1
