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


echo " "
echo "=============================="
echo "BUILDING GUI"
echo "=============================="
sh ./build_gui.sh

echo " "
echo "=============================="
echo "STARTING GUI"
echo "=============================="
sh ./start_gui.sh
