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

COMPILER="$DEPENDENCIES_ROOT/api-eosio-compiler"
CONFIG_FILE=$HOME

ISDEV=false
CLEARBROWSERSTORAGE=false
ENDPOINTS=false
NODE=false
DB=false
nodeos_endpoint="http://localhost:8888"
db_endpoint="mongodb://localhost:27788/eosio_nodeos_mongodb_plugin"

USAGE="Usage: eosio-explorer start_gui [--clear-browser-storage]
                                [--set-endpoints | node=<nodeos_endpoint> db=<mongodb_endpoint>] 
                                [-dev | --develop] (program to start eosio-explorer gui)

where:
    --clear-browser-storage       Starts the tool with clearing browser local storage

    Only available in production:
    --set-endpoints               Prompts user to input the existing nodeos and MongoDB instance endpoints to connect with
    node=<nodeos_endpoint> 
    db=<mongodb_endpoint>         Starts the tool by connecting to the nodeos and MongoDB endpoints passed

    Only available in development:
    -dev, --develop               Starts the tool in development mode"


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
    --set-endpoints)
      ENDPOINTS=true
      ;;     
    node=*)
      NODE=true
      nodeos_endpoint="${arg#*=}"
      ;;
    db=*) 
      DB=true
      db_endpoint="${arg#*=}"
      ;;
    -h|--help)
      echo " "
      echo "$USAGE"
      echo " "
      exit
      ;;
    *)
      printf "Unknown option: %s\n" "$arg" >&2
      echo " "
      echo "$USAGE" >&2
      exit 1
      ;;
  esac
done

# If --set-endpoints is passed the read the endpoints and store the value
if $ENDPOINTS; then    
  echo " "
  echo "Please enter Nodeos endpoint:"
  read nodeos_endpoint
  echo " "
  echo "Please enter MongoDB endpoint:"
  read db_endpoint  
  echo " "  
  echo "Storing endpoints to config file..."
  (cd $CONFIG_FILE && echo '{ "NodesEndpoint" : "'$nodeos_endpoint'", "DBEndpoint" : "'$db_endpoint' " }'>eosio_explorer_config.json && printf "${GREEN}done${NC}")
elif ( $NODE && $DB ); then
  echo "Storing endpoints to config file..."
  (cd $CONFIG_FILE && echo '{ "NodesEndpoint" : "'$nodeos_endpoint'", "DBEndpoint" : "'$db_endpoint' " }'>eosio_explorer_config.json && printf "${GREEN}done${NC}")
fi

FILE=$CONFIG_FILE/eosio_explorer_config.json
if [ -f "$FILE" ]; then
  echo " "
  echo "$FILE exists"
else
  echo " "
  printf "${RED}$FILE does not exist, calling init..\n ${NC}"
  echo " "
  ./init.sh
fi

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
echo "================================="
echo "STARTING APP AND COMPILER SERVICE"
echo "================================="

if $ISDEV; then
  (cd $COMPILER && yarn start &)
  if $CLEARBROWSERSTORAGE; then
    # Set environment variable "REACT_APP_LAST_INIT_TIMESTAMP" at dev build to create a new timestamp in CRA development
    (cd $APP && REACT_APP_LAST_INIT_TIMESTAMP=$(date +%s) PORT=$APP_DEV_PORT yarn start)
  else
    (cd $APP && PORT=$APP_DEV_PORT yarn start)
  fi
else
  # run yarn serve-clear to adding env CLEARBROWSERSTORAGE=true while starting to serve
  if $CLEARBROWSERSTORAGE; then
    (cd $APP && yarn serve-clear $COMPILER $CONFIG_FILE/eosio_explorer_config.json)
  else
    (cd $APP && yarn serve $COMPILER $CONFIG_FILE/eosio_explorer_config.json)
  fi
fi
