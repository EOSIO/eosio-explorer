#!/usr/bin/env bash

RED='\033[0;31m'
NC='\033[0m' # No Color
GREEN='\033[0;32m'

SCRIPTPATH="$( pwd -P )"
GUI="$SCRIPTPATH/packages/ui-gui-nodeos"
ISDEV=false

if [ "$1" == "-dev" -o "$1" == "--develop" ]; then
  ISDEV=true
fi

echo 'in start ' + $ISDEV

echo " "
echo "=============================="
echo "STARTING GUI"
echo "=============================="
if $ISDEV; then
  (cd $GUI && yarn start)
else
  (cd $GUI && yarn serve)
fi