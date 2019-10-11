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
SHIPDOCKER="$DEPENDENCIES_ROOT/docker-ship"
CONFIG_FILE=$HOME

ISDEV=false
CLEARBROWSERSTORAGE=false
BUILDAPPLICATION=false
MAKESAMPLEDATA=false
SERVERMODE=false
HARDREPLAY=false
NOTIMESTAMP=false


USAGE="Usage: eosio-explorer start [-del | --delete] [--server-mode] [-s | --sample-data] [--clear-browser-storage]
                            [-dev] [-del] [-b]  [--no-timestamp ] (program to start eosio-explorer)

where:
    -del, --delete            Removes existing Docker containers
    --server-mode             Starts the tool in server-mode, it will start the dockers but not the gui
    --clear-browser-storage   Starts the tool with clearing browser local storage

    Only available in development:
    -dev, --develop           Starts the tool in development mode
    -b, --build               Build gui
    --no-timestamp            Builds gui without adding env LASTTIMESTAMP. Should only used by developer right before making a release"

write_to_log()
{
  echo $1 >> $APP/logger.txt  
}
write_to_log "--------------------------"
write_to_log "Arguments passed to start:"
# check for arguments
for arg in $@
do
  write_to_log "$arg"
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
    --set-mode=*)      
      ;;  
    --nodeos-endpoint=*|nodeos-endpoint=*)
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
  echo "required to build the app"
  write_to_log "required to build the app"
  BUILDAPPLICATION=true
fi

FILE=$CONFIG_FILE/eosio_explorer_config.json
if [ -f "$FILE" ]; then
  echo " "
  echo "$FILE exists"
  write_to_log "config file exists"
else
  echo " "
  printf "${RED}$FILE does not exist, calling init...\n ${NC}"
  write_to_log "config file doesn't exists, calling init..."
  echo " "
  ./init.sh
fi

# Get the endpoint stored in config file
nodeos_endpoint=$(cat $CONFIG_FILE/eosio_explorer_config.json | sed -n 's|.*"NodeEndpoint":"\([^"]*\)".*|\1|p')

write_to_log "endpoint read from config file: $nodeos_endpoint"
echo "Connecting to $nodeos_endpoint"

if [ $nodeos_endpoint == $NODE_DEFAULT_ENDPOINT ] 
then
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
    if [[ "$waitcounter" -lt 10 ]]; then
      echo " "
      echo "$((waitcounter+1)) - Waiting for dockers to be started..."
      sleep 10s
      waitcounter=$((waitcounter+1))
    else
      # if the blockchain is not running even after a minute, remove the dockers and try to start again
      write_to_log "problem starting eosio nodeos docker"
      echo " "
      printf "${RED}Problem starting docker${NC}"
      echo " "
      echo "here is what you can do"
      echo "eosio-explorer start --delete (this will clear the data and start the application)"
      echo "eosio-explorer init (this will initialize the application, clear all the blockchain and postgres db data and start the application)"
      exit 0
    fi
  done
  write_to_log "eosio docker started"
fi

echo " "
echo "==========================================="
echo "STARTING STATE HISTORY PLUGIN FILLER DOCKER"
echo "==========================================="
(cd $SHIPDOCKER && ./start_ship_docker.sh && printf "${GREEN}done${NC}")
write_to_log "State history plugin filler docker started"

if ( ! $SERVERMODE ); then
  # If the production version of the application needs to be built
  if ( $BUILDAPPLICATION ); then
    # create a static build of application for production
    echo " "
    echo "=============================="
    echo "BUILDING APPLICATION"
    echo "=============================="
    write_to_log "Building the GUI"
    # Set environment variable "REACT_APP_LAST_INIT_TIMESTAMP" at build time to create a new timestamp while serving the app.
    if ( ! $NOTIMESTAMP ); then
      (cd $APP && REACT_APP_LAST_INIT_TIMESTAMP=$(date +%s) yarn build && printf "${GREEN}done${NC}")
    else
      # Build without timestamp, this should only be used right before we are doing a release by publishing the build folder to npm

      echo "You are building gui without a last timestamp!"
      echo " "
      (cd $APP && yarn build && printf "${GREEN}done${NC}")
    fi
    nodeos_endpoint=$(cat $CONFIG_FILE/eosio_explorer_config.json | sed -n 's|.*"NodeEndpoint":"\([^"]*\)".*|\1|p')
    (cd $APP/build && echo 'window._env_={"NODE_PATH": "'$nodeos_endpoint'"}'>env-config.js)
    write_to_log "nodeos endpoint is written to front-end config file"
  fi

  write_to_log "call start_gui"
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
  write_to_log "dockers have been started, GUI won't be started"
fi

P1=$!

# wait $P1
wait $P1
