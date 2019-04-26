# docker-eosio-nodeos
`docker-eosio-nodeos` is responsible for creating a Docker container that runs a local instance of `nodeos`, which will continuously create blocks and gives users an endpoint to deploy contracts and push actions to.

## Manual Usage
Navigating to this package root will give user access to the Dockerfile and build scripts, which are needed to get the Docker container set up and running. Executing `./build_eosio_docker.sh` will check if the Docker image has been built, and will build the image if necessary. Users should run that script during the initial setup phase.

Once the Docker image has been built, you can start the Docker container by running `./start_eosio_docker.sh` but be sure that you have a running MongoDB service available (at `mongodb://localhost:27788` for example) before starting it.

You can stop the container directly by executing `docker stop eosio_nodeos`. If you wish to reinitialize the container, you will need to delete and remake the `data` folder, which contains the block log and other related information before removing the container and restarting it again. You can run all of this in one command with the following:
```
rm -rf data && mkdir data && docker rm -fv eosio_nodeos && ./start_eosio_docker.sh
```
