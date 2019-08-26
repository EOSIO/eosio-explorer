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
SHIPDOCKER="$DEPENDENCIES_ROOT/docker-ship"
LOCALSERVICE="$DEPENDENCIES_ROOT/api-eosio-compiler"
COMPILER="$LOCALSERVICE/docker-eosio-cdt"
ISDEV=false
MAKESAMPLEDATA=false
nodeos_endpoint=$NODE_DEFAULT_ENDPOINT
domain_name="localhost"


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

 

echo "Please type 1, 2 or 3, to start the tool and connect to your required endpoint, which are as follows: "
echo ""
echo "1. Default Node endpoint provided by the tool"
echo "2. A pre-existing Node endpoint"
echo "3. The Node endpoint detailed in the config file (location: $HOME/eosio_explorer_config.json)"

read option

echo " "
if [ $option == 1 ]
then 
  echo "Starting tool with default endpoints..."  
elif [ $option == 2 ]
then 
  echo "Please enter Node endpoint:"
  read nodeos_endpoint
elif [ $option == 3 ]
then
  echo "Reading the endpoint from $HOME/eosio_explorer_config.json" 
  nodeos_endpoint=$(cat $HOME/eosio_explorer_config.json | sed -n 's|.*"NodeEndpoint":"\([^"]*\)".*|\1|p')
else
  echo "Invalid option, starting tool with default endpoints... "
fi  

#remove '/' at the end if any
nodeos_endpoint=${nodeos_endpoint%/};

echo " "
echo "Connecting to $nodeos_endpoint"

if [ $option == 2 ];
then
  echo " "
  echo "========================"
  echo "VALIDATING NODE ENDPOINT"
  echo "========================"
  blockchain_info=`curl --max-time 15 $nodeos_endpoint/v1/chain/get_info -k -s -f -o /dev/null && echo "SUCCESS" || echo "ERROR"` 
  echo $blockchain_info

  if [ $blockchain_info != "ERROR" ];
  then 
    echo " "
    echo "========================"
    echo "CHECKING THE EOS VERSION"
    echo "========================"
    # extract version from the get_info output
    version=$(curl -s $nodeos_endpoint/v1/chain/get_info | sed -n 's|.*"server_version_string":"\([^"]*\)".*|\1|p')  
    echo "version $version" 
    version=${version:1:5}

    # Check the extracted version if it's a number
    re='^[0-9.]+$'
    if ! [[ $version =~ $re ]] ; then
      echo " "
      printf "${RED}The EOS version of the node you are trying to connect to is not compatible with the tool, \nplease run the command again with the node endpoint running on EOS version 1.8.1 above \n ${NC}"
      echo " "
      exit 1
    else
      if [[ "$version" > 1.8.0 ]];
      then
        echo "Compatible with tool"        
      else
        echo " "
        printf "${RED}The EOS version of the node you are trying to connect to is not compatible with the tool, \nplease run the command again with the node endpoint running on EOS version 1.8.1 above \n ${NC}"
        echo " "
        exit 1
      fi  
    fi   
    #  remove this
    # exit 1
  else
    echo " "
    printf "${RED}Invalid node endpoint, please run the command again with a valid endpoint \n ${NC}"
    echo " "
    exit 1
  fi      
fi
  
echo " "
echo "==============================="
echo "INITIALISING CONFIG IN PACKAGES"
echo "==============================="

# copy init config into different packages
cp -f $APP/init_config.file $EOSDOCKER/config.file.local
cp -f $APP/init_config.file $EOSDOCKER/scripts/config.file.local
cp -f $APP/init_config.file $COMPILER/config.file.local
cp -f $APP/init_config.file $SHIPDOCKER/config.file.local
cp -f $APP/init_config.file $APP/config.file.local

# extract domain name from the URL for fill-pg
domain_name=$(echo $nodeos_endpoint | cut -d'/' -f3 | cut -d':' -f1)

echo "NODE_ENDPOINT_DOMAIN_NAME=$domain_name" >> $SHIPDOCKER/config.file.local

# print init config and save it as .env.local into different packages

rm -f $APP/.env.local
echo "REACT_APP_LOCAL_SERVICE_PORT=$LOCAL_SERVICE_PORT" >> $APP/.env.local
echo "REACT_APP_APP_SERVE_PORT=$APP_SERVE_PORT" >> $APP/.env.local

echo "LOCAL_SERVICE_PORT=$LOCAL_SERVICE_PORT" > $LOCALSERVICE/.env.local

echo "Copying initial config done."
echo " "

# DO NOT yarn install if the app is installed globally to avoid node modules collision
if [[ !($PWD == $YARN_GLOBAL_DIR*) ]]; then
  echo "======================="
  echo "INSTALLING DEPENDENCIES"
  echo "======================="
  yarn install
fi

echo " "
echo "====================="
echo "BUILDING EOSIO DOCKER"
echo "====================="
(cd $EOSDOCKER && ./build_eosio_docker.sh && printf "${GREEN}done${NC}")

echo " "
echo "=================================================="
echo "BUILDING EOSIO_CDT DOCKER USED BY COMPILER SERVICE"
echo "=================================================="
(cd $COMPILER && ./build_eosio_cdt_docker.sh && printf "${GREEN}done${NC}")

echo " "
echo "===================================="
echo "BUILDING STATE HISTORY PLUGIN DOCKER"
echo "===================================="
(cd $SHIPDOCKER && ./build_ship_docker.sh && printf "${GREEN}done${NC}")

# remove existing dockers
./remove_dockers.sh

if [ $option != 3 ];
then
  #Create a config file in home directory
  echo " "
  echo "========================================"
  echo "Creating config files to store endpoints"
  echo "========================================"

  (cd $HOME && echo '{"NodeEndpoint":"'$nodeos_endpoint'"}'>eosio_explorer_config.json && printf "${GREEN}done${NC}")

  echo " "
  echo "Path:" $HOME/eosio_explorer_config.json 
  echo '{"NodeEndpoint":"'$nodeos_endpoint'"}'
  echo " "
fi  

#Inserting the entered endpoint from the user to a config file to connect to from front-end
if $ISDEV; then
  (cd $APP/public && echo 'window._env_={"NODE_PATH": "'$nodeos_endpoint'"}'>env-config.js)
else
  (cd $APP/build && echo 'window._env_={"NODE_PATH": "'$nodeos_endpoint'"}'>env-config.js)
fi

# start the dockers and gui

./start.sh $@ --clear-browser-storage

P1=$!

# wait $P1
wait $P1
