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

  esac
done
