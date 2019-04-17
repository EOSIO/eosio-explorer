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
# Set environment variable "LAST_FIRST_TIME_SETUP_TIMESTAMP" at build time to create a new timestamp while serving the app.
(cd $GUI && REACT_APP_LAST_FIRST_TIME_SETUP_TIMESTAMP=$(date +%s) yarn build && printf "${GREEN}done${NC}")
