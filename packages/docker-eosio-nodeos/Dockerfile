FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install -y wget sudo curl

RUN wget https://github.com/EOSIO/eos/releases/download/v1.6.0/eosio_1.6.0-1-ubuntu-18.04_amd64.deb
RUN sudo apt install -y ./eosio_1.6.0-1-ubuntu-18.04_amd64.deb

CMD ./start.sh
