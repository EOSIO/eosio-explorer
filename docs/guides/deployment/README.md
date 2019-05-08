[Home](../..) > Guides > Deployment

# Introduction

The deployment process is composed of three steps, one of which is optional. Each of the steps is covered as part of a basic guide on how to use the [Deploy Contracts Page](../../pages/interact/deployment-page.md).

The deployment flow is simple:

1. The user [selects the entry file](step-one.md) which the compiler uses as the basis for ABI compilation.
2. The user can optionally [compile/generate/import](step-two.md) the ABI file, depending on their needs.
3. The user [deploys](step-three.md) the contract source code.

Instructions are also available inside the page as a quick reference. 

## Compiler Service

As part of the local service tool, a Node.JS service will be started in conjunction with the tool that is responsible for smart contract compilation and deployment. You can view the source code for it [here](https://github.com/EOSIO/eosio-toppings/tree/master/packages/api-eosio-compiler). Whenever the guide mentions a "compiler", this is service is what will be used to perform those specific actions.
