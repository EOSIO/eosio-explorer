# Introduction
Create a docker image with a EOSIO nodeos inside.
Cloned from https://github.com/EOSIO/eosio-project-boilerplate-simple

## Depended by Packages
* api-rpc

## Used by Applications
* GUI of Nodeos

# Development
cd into package root `/packages/docker-eosio-nodeos`

## Initial setup

```sh
./first_time_setup.sh
```

## Start
Start nodeos by creating and running a docker container.

```sh
./start_eosio_docker.sh
```
* Make sure a mongodb service is running ( mongodb://localhost:27017 ) before you start the nodeos.

## Stop
Stop nodeos ( stop docker container )

```sh
docker stop name=eosio_gui_nodeos_container
```

## Restart
Reset and restart

```sh
rm -rf data/ && mkdir data && docker rm eosio_gui_nodeos_container && ./start_eosio_docker.sh
```
