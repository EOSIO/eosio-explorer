# Introduction
The application: GUI of Nodeos

# Shell Scripts

Before anything, kindly run `./one_time_setup.sh` in order to verify that you have built all the necessary Docker images for the application to work. It will set up the dependencies for you.

### Starting the Blockchain

`./start_blockchain.sh` will start the blockchain for you. 

### Pausing and Resuming the Blockchain

`./pause_blockchain.sh` will stop the blockchain for you. The MongoDB will still be running, so you can resume the blockchain by running `./resume_blockchain.sh`.

### Clear all Blockchain Data

If you wish to restart from an empty slate, call `./clear_all_blockchain_data.sh` in order to clear all block log data and also the MongoDB data. Call `./start_blockchain.sh` once again to start from scratch.
