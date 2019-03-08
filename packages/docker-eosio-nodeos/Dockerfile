FROM ubuntu:18.04

RUN apt-get update && apt-get install -y wget sudo curl

RUN wget https://github.com/EOSIO/eos/releases/download/v1.6.3/eosio_1.6.3-1-ubuntu-18.04_amd64.deb
RUN apt-get update && sudo apt install -y ./eosio_1.6.3-1-ubuntu-18.04_amd64.deb
