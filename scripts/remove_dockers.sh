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

RED='\033[0;31m'
NC='\033[0m' # No Color
GREEN='\033[0;32m'

PWD=$(pwd -P)
YARN_GLOBAL_DIR=$(yarn global dir)

# If current folder is localed inside yarn global folder, means it is installed globally
if [[ $PWD == $YARN_GLOBAL_DIR* ]]; then

    # yarn added globally, dependencies are installed as siblings directory
    DEPENDENCIES_ROOT="$(dirname "$(dirname "$( pwd -P )")")/$DEPENDENCIES_SCOPE_NAME"
else

    # yarn installed locally, dependencies are installed under current's project directory
    DEPENDENCIES_ROOT="$(dirname "$( pwd -P )")/node_modules/$DEPENDENCIES_SCOPE_NAME"
fi

EOSDOCKER="$DEPENDENCIES_ROOT/docker-eosio-nodeos"
MONGODOCKER="$DEPENDENCIES_ROOT/docker-mongodb"
SHIPDOCKER="$DEPENDENCIES_ROOT/docker-ship"
COMPILER="$DEPENDENCIES_ROOT/api-eosio-compiler/docker-eosio-cdt"

USAGE="Usage: eosio-explorer remove_dockers (Remove any currently present Docker containers)"

# check for arguments
for arg in $@
do
  case $arg in
    -h|--help)
      echo "$USAGE"
      exit
      ;;
    *)
      printf "Unknown option: %s\n" "$arg" >&2
      echo "$USAGE" >&2
      exit 1
      ;;
  esac
done

# remove existing dockers
echo " "
echo "=============================="
echo "CLEANING EXISTING EOSIO DOCKER"
echo "=============================="
(cd $EOSDOCKER && ./remove_eosio_docker.sh && printf "${GREEN}done${NC}")

echo " "
echo "================================"
echo "CLEANING EXISTING MONGODB DOCKER"
echo "================================"
(cd $MONGODOCKER && ./remove_mongodb_docker.sh && printf "${GREEN}done${NC}")

echo " "
echo "============================"
echo "CLEANING EXISTING CDT DOCKER"
echo "============================"
(cd $COMPILER && ./remove_eosio_cdt_docker.sh && printf "${GREEN}done${NC}")

echo " "
echo "======================================"
echo "CLEANING STATE HISTORY PLUGIN DOCKER"
echo "======================================"
(cd $SHIPDOCKER && ./remove_ship_docker.sh && printf "${GREEN}done${NC}")
