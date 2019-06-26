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

    # yarn added globally, dependencies are installed as siblings directory
    DEPENDENCIES_ROOT="$(dirname "$(dirname "$( pwd -P )")")/$DEPENDENCIES_SCOPE_NAME"
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
nodeos_endpoint="http://localhost:8888"
db_endpoint="mongodb://localhost:27788/eosio_nodeos_mongodb_plugin"

USAGE="Usage: eosio-explorer init [-s | --sample-data] [--server-mode]
                           [-dev | --develop] [-b | --build] (program to initialize eosio-explorer)

where:
    -s, --sample-data   Starts the tool with pre-existing sample accounts and smart contracts
    --server-mode       Starts the tool in server-mode, it will start the docker containers but not the gui

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

printf ${GREEN}"\n"
printf "=========================\n"
printf "Welcome to EOSIO Explorer\n"
printf "=========================\n"
printf "\n"${NC}

echo "Please choose an option by typing 1 or 2: "
echo "1. Start the tool by connecting to default endpoints given by the tool."
echo "2. Start the tool by connecting to existing endpoints."

read option

if [ $option == 1 ]
then 
  echo "Starting tool with default endpoints..."  
elif [ $option == 2 ]
then 
  echo "Please enter Nodeos endpoint:"
  read nodeos_endpoint
  echo "Please enter MongoDB endpoint:"
  read db_endpoint  
else
  echo "Invalid option, starting tool with default endpoints... "
fi  

echo "==============================="
echo "INITIALISING CONFIG IN PACKAGES"
echo "==============================="

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
  echo "========================="
  echo "INSTALLING DEPENDENCIES"
  echo "========================="
  yarn install
fi

echo " "
echo "==========================="
echo "BUILDING EOSIO DOCKER"
echo "==========================="
(cd $EOSDOCKER && ./build_eosio_docker.sh && printf "${GREEN}done${NC}")

echo " "
echo "=================================================="
echo "BUILDING EOSIO_CDT DOCKER USED BY COMPILER SERVICE"
echo "=================================================="
(cd $COMPILER && ./build_eosio_cdt_docker.sh && printf "${GREEN}done${NC}")

# remove existing dockers
./remove_dockers.sh

#Create a config file in home directory
echo " "
echo "========================================"
echo "Creating config files to store endpoints"
echo "========================================"

(cd $HOME && echo '{"NodesEndpoint":"'$nodeos_endpoint'","DBEndpoint":"'$db_endpoint'"}'>eosio_explorer_config.json && printf "${GREEN}done${NC}")

echo " "
echo "Path:" $HOME/eosio_explorer_config.json 
echo '{"NodesEndpoint":"'$nodeos_endpoint'","DBEndpoint":"'$db_endpoint'"}'
echo " "
# start the dockers and gui

./start.sh $@ --clear-browser-storage

P1=$!

# wait $P1
wait $P1
