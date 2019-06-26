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
CONFIG_FILE=$HOME

ISDEV=false
CLEARBROWSERSTORAGE=false
BUILDAPPLICATION=false
MAKESAMPLEDATA=false
SERVERMODE=false
HARDREPLAY=false
NOTIMESTAMP=false
ENDPOINTS=false
NODE=false
DB=false
nodeos_endpoint="http://localhost:8888"
db_endpoint="mongodb://localhost:27788/eosio_nodeos_mongodb_plugin"

USAGE="Usage: eosio-explorer start [-del | --delete] [--server-mode] [-s | --sample-data] [--clear-browser-storage] 
                            [--set-endpoints | node=<nodeos_endpoint> db=<mongodb_endpoint>]
                            [-dev] [-del] [-b]  [--no-timestamp ] (program to start eosio-explorer)

where:
    -del, --delete            Removes existing Docker containers
    --server-mode             Starts the tool in server-mode, it will start the dockers but not the gui
    -s, --sample-data         Starts the tool with pre-existing sample accounts and smart contracts
    --clear-browser-storage   Starts the tool with clearing browser local storage
    
    Only available in production:
    --set-endpoints           Prompts user to input existing nodeos and MongoDB instance endpoints to connect with
    node=<nodeos_endpoint> 
    db=<mongodb_endpoint>     Starts the tool by connecting to the nodeos and MongoDB endpoints passed

    Only available in development:
    -dev, --develop           Starts the tool in development mode
    -b, --build               Build gui
    --no-timestamp            Builds gui without adding env LASTTIMESTAMP. Should only used by developer right before making a release"


# check for arguments
for arg in $@
do
  case $arg in
    -del|--delete)
      ./remove_dockers.sh
      CLEARBROWSERSTORAGE=true
      ;;
    -dev|--develop)
      ISDEV=true
      ;;
    --clear-browser-storage)
      CLEARBROWSERSTORAGE=true
      ;;
    -s|--sample-data)
      MAKESAMPLEDATA=true
      ;;
    -b|--build)
      BUILDAPPLICATION=true
      ;;
    --server-mode)
      SERVERMODE=true
      ;;
    --hard-replay)
      HARDREPLAY=true
      ;;
    --no-timestamp)
      NOTIMESTAMP=true
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

# If either of these conditions are true:
#   user has not added -dev flag but:
#     the build folder does not exist
# Then build with a new timestamp.
if (!($ISDEV) && [ ! -e $APP"/build" ]); then
  BUILDAPPLICATION=true
fi

# If --set-endpoints is passed then read the endpoints and store the value
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

echo " "
echo "=============================="
echo "STARTING MONGODB DOCKER"
echo "=============================="
(cd $MONGODOCKER && ./start_mongodb_docker.sh && printf "${GREEN}done${NC}")

echo " "
echo "=============================="
echo "STARTING EOSIO DOCKER"
echo "=============================="
if ($MAKESAMPLEDATA); then
  (cd $EOSDOCKER && ./start_eosio_docker.sh --nolog --sample-data && printf "${GREEN}done${NC}")
elif ($HARDREPLAY) then
  (cd $EOSDOCKER && ./start_eosio_docker.sh --nolog --hard-replay && printf "${GREEN}done${NC}")
else
  (cd $EOSDOCKER && ./start_eosio_docker.sh --nolog && printf "${GREEN}done${NC}")
fi

# wait until eosio blockchain is started
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
    # if the blockchain is not running even after a minute, remove the dockers and try to start again
    echo " "
    printf "${RED}Problem starting docker${NC}"
    echo " "
    echo "here is what you can do"
    echo "eosio-explorer start --delete (this will clear the data and start the application)"
    echo "eosio-explorer init (this will initialize the application, clear all the blockchain and mongo data and start the application)"
    exit 0
  fi
done


if ( ! $SERVERMODE ); then
  # If the production version of the application needs to be built
  if ( $BUILDAPPLICATION ); then
    # create a static build of application for production
    echo " "
    echo "=============================="
    echo "BUILDING APPLICATION"
    echo "=============================="

    # Set environment variable "REACT_APP_LAST_INIT_TIMESTAMP" at build time to create a new timestamp while serving the app.
    if ( ! $NOTIMESTAMP ); then
      (cd $APP && REACT_APP_LAST_INIT_TIMESTAMP=$(date +%s) yarn build && printf "${GREEN}done${NC}")
    else
      # Build without timestamp, this should only be used right before we are doing a release by publishing the build folder to npm

      echo "You are building gui without a last timestamp!"
      echo " "
      (cd $APP && yarn build && printf "${GREEN}done${NC}")
    fi
  fi

  # build and start the application
  if $ISDEV; then
    # If there is -d or from init setup ( or clear browser storage ), clear the browser storage by adding a new timestamp when start CRA dev.
    if $CLEARBROWSERSTORAGE; then
      ./start_gui.sh -dev --clear-browser-storage
    else
      ./start_gui.sh -dev
    fi
  else
    # If there is -d or from init setup ( or clear browser storage ), clear the browser storage by setting CLEARBROWSERSTORAGE=true while serve.
    if $CLEARBROWSERSTORAGE; then  
      ./start_gui.sh --clear-browser-storage
    else      
      ./start_gui.sh
    fi
  fi
else
  echo ""
  echo "dockers have been started, you can now connect to this server"
fi

P1=$!

# wait $P1
wait $P1
