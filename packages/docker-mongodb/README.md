# Introduction
Create a docker image with a mongodb service inside.

# Depended by Packages
* docker-eosio-nodeos
* api-mongodb-plugin

# Used by Applications
* GUI of Nodeos

# Development
cd into package root `/packages/docker-mongodb`

## Start
Start nodeos by creating and running a docker container.

```sh
docker run -d -p 27017:27017 --name eosio-mongodb -v $(pwd)/data:/data/db mongo
```

* Make sure a mongodb service is running ( mongodb://localhost:27017 ) before you start the nodeos.

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
