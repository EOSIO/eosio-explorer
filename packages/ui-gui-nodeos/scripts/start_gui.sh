#!/usr/bin/env bash

RED='\033[0;31m'
NC='\033[0m' # No Color
GREEN='\033[0;32m'

SCRIPTPATH="$( pwd -P )"
ROOTPATH="../../.."
if find "$ROOTPATH/packages/docker-eosio-nodeos" -mindepth 1 -print -quit 2>/dev/null | grep -q .; then
  SCRIPTPATH="../../.."
fi

GUI="$SCRIPTPATH/packages/ui-gui-nodeos"
COMPILER="$SCRIPTPATH/packages/api-eosio-compiler"

ISDEV=false
ISFIRSTTIMESETUP=false

for arg in $@
do
    case $arg in
      -dev|--develop)
        ISDEV=true
        ;;
      --first-time-setup)
        ISFIRSTTIMESETUP=true
        ;;
  esac
done

# start compiler service in background
echo " "
echo "=============================="
echo "STARTING COMPILER SERVICE"
echo "=============================="
(cd $COMPILER && yarn start > compiler.log &)

echo " "
echo "=============================="
echo "STARTING GUI"
echo "=============================="
if $ISDEV; then
  # if $ISFIRSTTIMESETUP; then
  #   # Set environment variable "LAST_FIRST_TIME_SETUP_TIMESTAMP" at dev build to create a new timestamp in CRA development
  #   (cd $GUI && REACT_APP_LAST_FIRST_TIME_SETUP_TIMESTAMP=$(date +%s) yarn start)
  # else
    (cd $GUI && yarn start)
  #fi
else
  (cd $GUI && yarn serve)
fi
