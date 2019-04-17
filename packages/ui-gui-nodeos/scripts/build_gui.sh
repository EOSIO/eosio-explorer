#!/usr/bin/env bash

RED='\033[0;31m'
NC='\033[0m' # No Color
GREEN='\033[0;32m'

# Set environment variable "LAST_FIRST_TIME_SETUP_TIMESTAMP" at build time to create a new timestamp while serving the app.
(cd .. && REACT_APP_LAST_FIRST_TIME_SETUP_TIMESTAMP=$(date +%s) yarn build && printf "${GREEN}done${NC}")
