# docker-mongodb
`docker-mongodb` is responsible for creating a Docker container that runs a MongoDB service. This directory also contains the data written to the MongoDB from the `nodeos` container courtesy of the MongoDB plugin upon startup of the `nodeos` instance.

## Manual Usage
Firstly, be sure that this working directory has a `data` directory. If not, you can create one yourself by doing `mkdir data`. While there are shell scripts available for your convenience, you can also manually start the MongoDB service by running the following Docker command:
```
docker run -d -p 27017:27017 --name eosio-mongodb -v $(pwd)/data:/data/db mongo
```
This creates a Docker container called `eosio-mongodb` which should be started first before starting the Docker container running `nodeos`.

If you wish to re-initialize your MongoDB service, then you will have to remove and remake the `data` directory, and then remove and run the MongoDB container once more. You can run everything in one line by entering the following command:
```
rm -rf data/ && mkdir data && docker rm -fv eosio-mongodb && docker run -d -p 27017:27017 --name eosio-mongodb -v $(pwd)/data:/data/db mongo
```