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

EOSDOCKER="$DEPENDENCIES_ROOT/docker-eosio-nodeos"
MONGODOCKER="$DEPENDENCIES_ROOT/docker-mongodb"

ISDEV=false
ISDELETE=false
CLEARBROWSERSTORAGE=false
BUILDAPPLICATION=false
MAKESAMPLEDATA=false
SERVERMODE=false
HARDREPLAY=false
NOTIMESTAMP=false

USAGE="Usage: eosio-explorer start [-dev] [-d] [-b] [-s] [--init] [--server-mode] (program to start eosio-explorer)

where:
    -dev, --develop     Starts the tool in development mode
    -d, --delete        Removes existing Docker containers
    -b, --build         Build gui
    -s, --sample-data   Starts the tool with pre-existing sample accounts and smart contracts
    --init              Opens the tools with cleared local storage
    --server-mode       Starts the tool in server-mode, it will start the dockers but not the gui
    --no-timestamp      Builds gui without adding env LASTTIMESTAMP. Should only used by developer right before making a release"


# check for arguments
for arg in $@
do
  case $arg in
    -d|--delete)
      ./remove_dockers.sh
      ISDELETE=true
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

# If either of these conditions are true:
#   user has not added -dev flag but:
#     has added -d flag
#     the build folder does not exist
# Then build with a new timestamp.
if (!($ISDEV) && ($ISDELETE || [ ! -e $APP"/build" ])); then
  BUILDAPPLICATION=true
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
    # If there is -d or from init setup, clear the browser storage by adding a new timestamp when start CRA dev.
    if ($ISDELETE || $ISINIT); then
      ./start_gui.sh -dev --clear-browser-storage
    else
      ./start_gui.sh -dev
    fi
  else
    # If this is from init setup, clear the browser storage by setting CLEARBROWSERSTORAGE=true while serve.
    if $ISINIT; then
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
