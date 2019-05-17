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
ISINIT=false
BUILDAPPLICATION=false
MAKESAMPLEDATA=false
SERVERMODE=false

USAGE="Usage: $(basename "$0") [-dev] [-d] [-b] [-s] [--init] [--server-mode] (program to start eosio-explorer)

where:
    -dev, --develop     Starts the tool in development mode
    -d, --delete        Removes existing Docker containers
    -b, --build         Re-build gui
    -s, --sample-data   Starts the tool with pre-existing sample accounts and smart contracts
    --init              Builds a production-ready version of the web tool,
                          and opens the tool with cleared local storage
    --server-mode       Starts the tool in server-mode, it will start the dockers but not the gui"


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
    --init)
      ISINIT=true
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
#   init is being run
#   user has not added -dev flag but:
#     has added -d flag
#     the build folder does not exist
# Then build with a new timestamp.
if ( $ISINIT || (!($ISDEV) && ($ISDELETE || [ ! -e $APP"/build" ])) ); then
  BUILDAPPLICATION=true
fi

echo " "
echo "=============================="
echo "STARTING MONGODB DOCKER"
echo "=============================="
# check if container is paused
if [ "$(docker ps -q -f status=paused -f name=^$MONGODB_CONTAINER_NAME$)" ]; then
  echo 'resuming mongodb docker'
  docker unpause $MONGODB_CONTAINER_NAME
else
  # check if container exists
  if [ ! "$(docker ps -q -f name=^$MONGODB_CONTAINER_NAME$)" ]; then
    # check if volume exists
    if [ "$(docker volume ls --format '{{.Name}}' -f name=^$MONGODB_VOLUME_NAME$)" ]; then
        echo "mongodb docker is not running, but mongo volume exists"
        echo "removing volume"
        # remove volume if container doesnt exists
        docker volume rm --force $MONGODB_VOLUME_NAME
        sleep 10 #else docker fails  sometimes
    fi
  fi
  # start the docker
  (cd $MONGODOCKER && ./start_mongodb_docker.sh && printf "${GREEN}done${NC}")
fi

echo " "
echo "=============================="
echo "STARTING EOSIO DOCKER"
echo "=============================="
if [ "$(docker ps -q -f status=paused -f name=^$NODEOS_CONTAINER_NAME$)" ]; then
  echo 'resuming eosio docker'
  docker unpause $NODEOS_CONTAINER_NAME
else
  # check if container exists
  if [ ! "$(docker ps -q -f name=^$NODEOS_CONTAINER_NAME$)" ]; then
    # check if volume exists
    if [ "$(docker volume ls --format '{{.Name}}' -f name=^$NODEOS_VOLUME_NAME$)" ]; then
      echo "eosio docker is not running, but eosio volume exists"
      echo "cleaning data now"
      # remove volume if container doesnt exists
      docker volume rm --force $NODEOS_VOLUME_NAME
      sleep 10
    fi
  fi
  # start the docker
  if ($MAKESAMPLEDATA); then
    (cd $EOSDOCKER && ./start_eosio_docker.sh --nolog --sample-data && printf "${GREEN}done${NC}")
  else
    (cd $EOSDOCKER && ./start_eosio_docker.sh --nolog && printf "${GREEN}done${NC}")
  fi
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
    echo "Problem starting docker, removing dockers and restarting"
    ./remove_dockers.sh
    echo " "
    echo "Restarting eosio docker"
    ./start.sh $@
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
    (cd $APP && REACT_APP_LAST_INIT_TIMESTAMP=$(date +%s) yarn build && printf "${GREEN}done${NC}")
  fi

  # build and start the application
  # If there is -d or from init setup, clear the browser storage by adding a new timestamp when start CRA dev.
  if $ISDEV; then
    if ($ISDELETE || $ISINIT); then
      ./start_gui.sh -dev --clear-browser-storage
    else
      ./start_gui.sh -dev
    fi
  else
    ./start_gui.sh
  fi
else
  echo ""
  echo "dockers have been started, you can now connect to this server"
fi

P1=$!

# wait $P1
wait $P1
