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

COMPILER="$DEPENDENCIES_ROOT/api-eosio-compiler"

ISDEV=false
CLEARBROWSERSTORAGE=false
USAGE="Usage: eosio-explorer start_gui [-dev] [--clear-browser-storage] (program to start eosio-explorer gui)

where:
    --clear-browser-storage   Starts the tool with clearing browser local storage
    Only available in development:
    -dev, --develop           Starts the tool in development mode"


# check for arguments
for arg in $@
do
  case $arg in
    -dev|--develop)
      ISDEV=true
      ;;
    --clear-browser-storage)
      CLEARBROWSERSTORAGE=true
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

# kill cdt service when you stop application
# trap "exit" INT TERM ERR
# trap "kill 0" EXIT

echo " "
echo "=============================="
echo "STARTING CDT DOCKER"
echo "=============================="
# start the docker
(cd $COMPILER/docker-eosio-cdt && ./start_eosio_cdt_docker.sh && printf "${GREEN}done${NC}")


echo " "
echo "=============================="
echo "STARTING APP AND COMPILER SERVICE"
echo "=============================="
if $ISDEV; then
  if $CLEARBROWSERSTORAGE; then
    # Set environment variable "REACT_APP_LAST_INIT_TIMESTAMP" at dev build to create a new timestamp in CRA development
    (cd $APP && REACT_APP_LAST_INIT_TIMESTAMP=$(date +%s) PORT=$APP_DEV_PORT yarn start)
  else
    (cd $APP && PORT=$APP_DEV_PORT yarn start)
  fi
else
  # run yarn serve-clear to adding env CLEARBROWSERSTORAGE=true while starting to serve
  if $CLEARBROWSERSTORAGE; then
    (cd $APP && yarn serve-clear $COMPILER)
  else
    (cd $APP && yarn serve $COMPILER)
  fi
fi
