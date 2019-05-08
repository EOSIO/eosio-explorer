#!/usr/bin/env bash

# cd into current working directory.
cd $( dirname "$0")

# Start getting symlinked file
SYMLINKEDFILE=$(readlink "$0")

# Break the while loop if the symlinked file is not a symlink
while [ -n "$SYMLINKEDFILE" ]
do

  # Get the filename of the symlinked file
  BASENAME=$( basename "$SYMLINKEDFILE" )

  # cd into the directory which containing the symlinked file
  cd $( pwd -P )/$( dirname "$SYMLINKEDFILE" )

  # Try getting next symlinked file if there is any
  SYMLINKEDFILE=$(readlink "$( pwd -P )/$BASENAME")

done

# since the symlinked file is not a symlink, we assume it should be the path of cli.js.
# cd into this directory and we could start the shell scripts.
cd $( dirname "$SYMLINKEDFILE" )

USAGE="Usage: eosio-explorer [command]

where [command]:
    init            Initialize the tool by installing all dependencies, setting up 
                    all Docker containers, etc.

    start           Start the tool, assumes the dependencies and Docker images are already prepared
                    
    start_gui       Starts the web tool locally without touching the nodeos and MongoDB containers

    pause_dockers   Pause any currently running Docker containers

    remove_dockers  Remove any currently present Docker containers"


for arg in $@
do
  case $arg in
    init)
    ./scripts/init.sh ${@:2}
    ;;

    start)
    ./scripts/start.sh ${@:2}
    ;;

    start_gui)
    ./scripts/start_gui.sh ${@:2}
    ;;

    pause_dockers)
    ./scripts/pause_dockers.sh ${@:2}
    ;;

    remove_dockers)
    ./scripts/remove_dockers.sh ${@:2}
    ;;

    -v|--version)
    echo $(cat package.json | grep version | awk -F: '{ print $2 }' | sed 's/[",]//g') 
    ;;

    -h|--help)
      echo "$USAGE"
      exit
    ;;

    *) 
      printf "invalid option: %s\n" "$arg" >&2
      echo "$USAGE" >&2
      exit 1
      ;;
  esac
done
