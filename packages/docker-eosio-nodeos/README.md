# Introduction
Create a docker image with a EOSIO nodeos inside.
Cloned from https://github.com/EOSIO/eosio-project-boilerplate-simple

## Depended by Packages
* api-rpc

## Used by Applications
* GUI of Nodeos

# Development
cd into package root `/packages/docker-eosio-nodeos`

## First Time Setup
Make a `data` directory.
```
mkdir data
```

## Start
Start nodeos by creating and running a docker container.

```
./start_eosio_docker.sh
```
* Make sure a mongodb service is running ( mongodb://localhost:27017 ) before you start the nodeos.

## Stop
Stop nodeos ( stop docker container )

```
docker stop eosio_notechain_container
```

## Restart
Reset and restart

```
rm -rf data/ && mkdir data && ./start_eosio_docker.sh
```
