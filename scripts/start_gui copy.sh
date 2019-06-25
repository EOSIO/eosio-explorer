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

ISDEV=false
CLEARBROWSERSTORAGE=false
ENDPOINTS=false
NODE=false
DB=false
nodeos_endpoint=""
db_endpoint=""

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


if $ENDPOINTS; then    
  echo " "
  echo "Please enter nodeos endpoint:"
  read nodeos_endpoint
  echo " "
  echo "Please enter MongoDB endpoint:"
  read db_endpoint  
  echo " "  

  echo "Storing endpoints to config file..."
  (cd $HOME && echo '{ "NodesEndpoint" : "'$nodeos_endpoint'", "DBEndpoint" : "'$db_endpoint' " }'>eosio_explorer_config.json && printf "${GREEN}done${NC}")
elif ( ! ($NODE && $DB) ); then
  echo " "
  echo "=================================="
  echo "READING ENDPOINTS FROM CONFIG FILE"
  echo "=================================="
  
  SCRIPT_PATH=$(pwd -P)
  PATH="$PATH:/opt/eosio/bin"
  echo hello
  # cat eosio_explorer_config.json | ./bin/jq '.NodesEndpoint'
  
  

  # (cd $HOME && cp eosio_explorer_config.json $SCRIPT_PATH/eosio_explorer_config.json)

  while 
  
    read line;
    
  do echo $line; done < eosio_explorer_config.txt

  # echo here $config

  echo "${config#\"NodesEndpoint\":\"*\",\"}"

  # re="NodesEndpoint":"((www|http:|https:)+[^\s]+[\w])"
  # echo `expr match "$config" "NodesEndpoint":"((www|http:|https:)+[^\s]+[\w])"`

  # if [[ $config =~ $re ]]; then
  #   echo ${BASH_REMATCH[1]}
  # fi 

  # (cd $SCRIPT_PATH && mkdir -p bin && curl -sSL -o bin/jq https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 && chmod +x bin/jq )
  
  # databasename=`$SCRIPT_PATH/bin/jq '.NodesEndpoint' eosio_explorer_config.json`
  # cat eosio_explorer_config.json | jq '.NodesEndpoint'
  # cat eosio_explorer_config.json | sed -e 's/[{}]/''/g' | awk -v RS=',"' -F: '/^NodesEndpoint/ {print $2}'

  echo $databasename
fi



# kill cdt service when you stop application
# trap "exit" INT TERM ERR
# trap "kill 0" EXIT

# echo " "
# echo "=============================="
# echo "STARTING CDT DOCKER"
# echo "=============================="
# # start the docker
# (cd $COMPILER/docker-eosio-cdt && ./start_eosio_cdt_docker.sh && printf "${GREEN}done${NC}")


# echo " "
# echo "=============================="
# echo "STARTING APP AND COMPILER SERVICE"
# echo "=============================="

# if $ISDEV; then
#   (cd $COMPILER && yarn start &)
#   echo " "
#   if $CLEARBROWSERSTORAGE; then
#     # Set environment variable "REACT_APP_LAST_INIT_TIMESTAMP" at dev build to create a new timestamp in CRA development
#     (cd $APP && REACT_APP_LAST_INIT_TIMESTAMP=$(date +%s) PORT=$APP_DEV_PORT yarn start)
#   else
#     (cd $APP && PORT=$APP_DEV_PORT yarn start)
#   fi
# else
#   # run yarn serve-clear to adding env CLEARBROWSERSTORAGE=true while starting to serve
#   if $CLEARBROWSERSTORAGE; then
#     (cd $APP && yarn serve-clear $COMPILER $nodeos_endpoint $db_endpoint)
#   else
#     (cd $APP && yarn serve $COMPILER $nodeos_endpoint $db_endpoint)
#   fi
# fi
