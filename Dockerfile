FROM node:10-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

RUN apk update && apk add bash

USER node

COPY --chown=node:node package*.json yarn.lock lerna.json *.sh ./

COPY --chown=node:node packages/ui-gui-nodeos ./packages/ui-gui-nodeos
COPY --chown=node:node packages/api-mongodb-plugin ./packages/api-mongodb-plugin
COPY --chown=node:node packages/api-rpc ./packages/api-rpc
COPY --chown=node:node packages/api-eosio-compiler ./packages/api-eosio-compiler

RUN yarn install

EXPOSE 3000 5000
