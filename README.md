<h1 align="center">EOSIO Explorer</h1>
<p align="center">
  A full web application to communicate with EOSIO blockchain in a local development environment built using React.
</p>

<p align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/eosio-explorer.svg">
</p>

## Quick Start
1. `yarn install` to install all the dependencies
2. `yarn start` to run in development mode

## Build and Serve
In production environment, `serve.js` is the file used to serve both API calls and the static files in the `build/...` files. During development, `src/setupProxy.js` is used to proxy the API calls to a background `serve.js` process. More details available in the [package.json](package.json), check `prestart`.

To build from source, run `yarn run build` to create a static distribution for a production environment. To serve, you can do `node serve.js` directly.

## Documentation

* [Main Documentation](./docs)
* [Development](./docs/development.md)

## Want to help?

Interested in contributing? That's awesome! Here are some [Contribution Guidelines](./CONTRIBUTING.md) and the [Code of Conduct](./CONTRIBUTING.md#conduct).

## License

[MIT](./LICENSE)

## Important

See LICENSE for copyright and license terms.  Block.one makes its contribution on a voluntary basis as a member of the EOSIO community and is not responsible for ensuring the overall performance of the software or any related applications.  We make no representation, warranty, guarantee or undertaking in respect of the software or any related documentation, whether expressed or implied, including but not limited to the warranties or merchantability, fitness for a particular purpose and noninfringement. In no event shall we be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or documentation or the use or other dealings in the software or documentation.  Any test results or performance figures are indicative and will not reflect performance under all conditions.  Any reference to any third party or third-party product, service or other resource is not an endorsement or recommendation by Block.one.  We are not responsible, and disclaim any and all responsibility and liability, for your use of or reliance on any of these resources. Third-party resources may be updated, changed or terminated at any time, so the information here may be out of date or inaccurate.

Wallets and related components are complex software that require the highest levels of security.  If incorrectly built or used, they may compromise users’ private keys and digital assets. Wallet applications and related components should undergo thorough security evaluations before being used.  Only experienced developers should work with this software.
