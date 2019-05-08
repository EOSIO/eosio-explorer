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

if [ 'node_modules' == $(basename "$(dirname "$(dirname "$( pwd -P )")")") ]; then

    # yarn added globally, dependencies are installed as siblings directory
    DEPENDENCIES_ROOT="$(dirname "$(dirname "$( pwd -P )")")/$DEPENDENCIES_SCOPE_NAME"

elif [ '@ptb1' == $(basename "$(dirname "$(dirname "$( pwd -P )")")") ]; then

    # yarn added globally with scope, dependencies are installed as siblings directory of one level upper
    DEPENDENCIES_ROOT="$(dirname "$(dirname "$(dirname "$( pwd -P )")")")/$DEPENDENCIES_SCOPE_NAME"
else

    # yarn installed locally, dependencies are installed under current's project directory
    DEPENDENCIES_ROOT="$(dirname "$( pwd -P )")/node_modules/$DEPENDENCIES_SCOPE_NAME"
fi

EOSDOCKER="$DEPENDENCIES_ROOT/docker-eosio-nodeos"
MONGODOCKER="$DEPENDENCIES_ROOT/docker-mongodb"
COMPILER="$DEPENDENCIES_ROOT/api-eosio-compiler/docker-eosio-cdt"

USAGE="Usage: $(basename "$0") (Remove any currently present Docker containers)"

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
