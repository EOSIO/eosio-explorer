# toppings
A monorepo with tools working on top of nodeos

# Development

## First time setup
For first time setup, run
```sh
./first_time_setup.sh
```
The above command will execute the following in sequence

1. Install all required dependencies
2. Build the docker images
3. Check and remove any existing docker with names `eosio-mongodb` and `eosio_gui_nodeos_container`
4. Start the dockers
5. Setup compiler api 
6. Start the GUI 

## Other important scripts
`quick_start.sh` - Start/Restart dockers, compiler service, & gui
`remove_dockers.sh` - Remove `eosio-mongodb` and `eosio_gui_nodeos_container` dockers
`pause_dockers.sh` - Pause `eosio-mongodb` and `eosio_gui_nodeos_container` dockers

## Development
Make sure you have `docker` installed and assigned 8Gb Ram for it.

To Start
`./quick_start.sh`

Start development on browser at http://localhost:3000


## Add a dependency in a package
Using `yarn add` won't update the dependencies in each packages.json for each package.

Instead, we should use below command to add a dependency in a package.

For example, adding `express` in `packages/ui-gui-nodeos`
```
yarn workspace @eos-toppings/ui-gui-nodeos add express
```
## License

[MIT](./LICENSE)

## Important

See LICENSE for copyright and license terms.  Block.one makes its contribution on a voluntary basis as a member of the EOSIO community and is not responsible for ensuring the overall performance of the software or any related applications.  We make no representation, warranty, guarantee or undertaking in respect of the software or any related documentation, whether expressed or implied, including but not limited to the warranties or merchantability, fitness for a particular purpose and noninfringement. In no event shall we be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or documentation or the use or other dealings in the software or documentation.  Any test results or performance figures are indicative and will not reflect performance under all conditions.  Any reference to any third party or third-party product, service or other resource is not an endorsement or recommendation by Block.one.  We are not responsible, and disclaim any and all responsibility and liability, for your use of or reliance on any of these resources. Third-party resources may be updated, changed or terminated at any time, so the information here may be out of date or inaccurate.