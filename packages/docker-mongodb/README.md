# Introduction
Create a docker image with a mongodb service inside.

# Depended by Packages
* docker-eosio-nodeos
* api-mongodb-plugin

# Used by Applications
* GUI of Nodeos

# Development
cd into package root `/packages/docker-mongodb`

## First Time Setup
Make a `data` directory.
```
mkdir data
```

## Start
Start nodeos by creating and running a docker container.

```sh
docker run -d -p 27017:27017 --name eosio-mongodb -v $(pwd)/data:/data/db mongo
```

## Stop
Stop nodeos ( stop docker container )

```sh
docker stop name=eosio-mongodb
```

## Restart
Reset and restart

```sh
rm -rf data/ && mkdir data && docker rm eosio-mongodb && docker run -d -p 27017:27017 --name eosio-mongodb -v $(pwd)/data:/data/db mongo
```
