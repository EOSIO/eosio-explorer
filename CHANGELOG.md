# Change Log

## [v0.3.4](https://github.com/EOSIO/eosio-explorer/tree/v0.3.4) (2019-07-10)
[Full Changelog](https://github.com/EOSIO/eosio-explorer/compare/v0.3.3...v0.3.4)

**Implemented enhancements:**

- update eos to 1.8.1 [\#125](https://github.com/EOSIO/eosio-explorer/pull/125) ([matharuajay](https://github.com/matharuajay))

## [v0.3.3](https://github.com/EOSIO/eosio-explorer/tree/v0.3.3) (2019-07-05)
[Full Changelog](https://github.com/EOSIO/eosio-explorer/compare/v0.3.2...v0.3.3)

**Implemented enhancements:**

- Upgrade eos version to 1.8 [\#124](https://github.com/EOSIO/eosio-explorer/pull/124) ([varshajnagaraja](https://github.com/varshajnagaraja))

## [v0.3.2](https://github.com/EOSIO/eosio-explorer/tree/v0.3.2) (2019-06-28)
[Full Changelog](https://github.com/EOSIO/eosio-explorer/compare/v0.3.1...v0.3.2)

**Implemented enhancements:**

- Fogbugz 3470: Start up scripts changes [\#122](https://github.com/EOSIO/eosio-explorer/pull/122) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Add link to smart contract name in Action history of Push action page [\#116](https://github.com/EOSIO/eosio-explorer/pull/116) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Refactor manage accounts page  [\#115](https://github.com/EOSIO/eosio-explorer/pull/115) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Adjustments to in-app console log terminal [\#110](https://github.com/EOSIO/eosio-explorer/pull/110) ([jcardenas9x](https://github.com/jcardenas9x))
- Fogbugz 3434 - Update timestamp colums [\#108](https://github.com/EOSIO/eosio-explorer/pull/108) ([matharuajay](https://github.com/matharuajay))
- Refactor all pollingEpic by using exhaustMap [\#106](https://github.com/EOSIO/eosio-explorer/pull/106) ([terrylks](https://github.com/terrylks))
- Fogbugz 3428: Help button not linking to context sensitive help [\#103](https://github.com/EOSIO/eosio-explorer/pull/103) ([varshajnagaraja](https://github.com/varshajnagaraja))

**Fixed bugs:**

- Fix a bug where calling eosio-explorer start right after eosio-explorer init would clear the local storage [\#121](https://github.com/EOSIO/eosio-explorer/pull/121) ([jcardenas9x](https://github.com/jcardenas9x))
- Refactor manage accounts page  [\#115](https://github.com/EOSIO/eosio-explorer/pull/115) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Adjustments to in-app console log terminal [\#110](https://github.com/EOSIO/eosio-explorer/pull/110) ([jcardenas9x](https://github.com/jcardenas9x))
- Fogbugz 3457 - Compiler service dev mode [\#107](https://github.com/EOSIO/eosio-explorer/pull/107) ([mjk90](https://github.com/mjk90))
- Fogbugz 3422 - Push Action: There is no sorting on filter by smart contract [\#105](https://github.com/EOSIO/eosio-explorer/pull/105) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Fogbugz 3419 - Error Console going off screen [\#104](https://github.com/EOSIO/eosio-explorer/pull/104) ([mjk90](https://github.com/mjk90))
- Fogbugz 3431 - Action history loading spinner [\#102](https://github.com/EOSIO/eosio-explorer/pull/102) ([mjk90](https://github.com/mjk90))
- Fogbugz 3425 - Deployment Page responsive CSS issues [\#101](https://github.com/EOSIO/eosio-explorer/pull/101) ([mjk90](https://github.com/mjk90))
- Fogbugz 3411: Improper not found styling on Action Detail Page [\#100](https://github.com/EOSIO/eosio-explorer/pull/100) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Move dotenv package back into "dependencies" for production build. [\#99](https://github.com/EOSIO/eosio-explorer/pull/99) ([terrylks](https://github.com/terrylks))

**Closed issues:**

- Cannot deploy contract with a header file. [\#109](https://github.com/EOSIO/eosio-explorer/issues/109)

**Merged pull requests:**

- Incoming doc update [\#123](https://github.com/EOSIO/eosio-explorer/pull/123) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Fogbugz 3469 - Generate a Unique Chain ID on each "init" [\#120](https://github.com/EOSIO/eosio-explorer/pull/120) ([mjk90](https://github.com/mjk90))
- Change '-d'  option to ' -del' in start command [\#117](https://github.com/EOSIO/eosio-explorer/pull/117) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Fogbugz 3453, 3393, 3456 - Push Action page changes & failed actions [\#112](https://github.com/EOSIO/eosio-explorer/pull/112) ([mjk90](https://github.com/mjk90))
- Removing init option from start command [\#111](https://github.com/EOSIO/eosio-explorer/pull/111) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Fogbugz 3451: Deploy Contract- Button comes on top of error console panel [\#98](https://github.com/EOSIO/eosio-explorer/pull/98) ([varshajnagaraja](https://github.com/varshajnagaraja))

## [v0.3.1](https://github.com/EOSIO/eosio-explorer/tree/v0.3.1) (2019-05-24)
[Full Changelog](https://github.com/EOSIO/eosio-explorer/compare/v0.3.1-alpha.0...v0.3.1)

**Implemented enhancements:**

- Remove legacy code which only used for npm private package. [\#97](https://github.com/EOSIO/eosio-explorer/pull/97) ([terrylks](https://github.com/terrylks))
- Align Console Logger to page padding. [\#96](https://github.com/EOSIO/eosio-explorer/pull/96) ([terrylks](https://github.com/terrylks))

## [v0.3.1-alpha.0](https://github.com/EOSIO/eosio-explorer/tree/v0.3.1-alpha.0) (2019-05-24)
[Full Changelog](https://github.com/EOSIO/eosio-explorer/compare/v0.3.0...v0.3.1-alpha.0)

**Implemented enhancements:**

- Move styled-components dependencies from eosio-toppings to here. [\#95](https://github.com/EOSIO/eosio-explorer/pull/95) ([terrylks](https://github.com/terrylks))
- Prepare push to npm with only build related files. [\#94](https://github.com/EOSIO/eosio-explorer/pull/94) ([terrylks](https://github.com/terrylks))
- Fogbugz 3447 - Add footer with Privacy Policy link [\#92](https://github.com/EOSIO/eosio-explorer/pull/92) ([mjk90](https://github.com/mjk90))
- Remove unnecessary dependencies [\#91](https://github.com/EOSIO/eosio-explorer/pull/91) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Fogbugz 3443 - In production mode, serve the app to user without building GUI while init [\#90](https://github.com/EOSIO/eosio-explorer/pull/90) ([terrylks](https://github.com/terrylks))
- Fogbugz 3442 - Handle docker volumes after restart [\#89](https://github.com/EOSIO/eosio-explorer/pull/89) ([matharuajay](https://github.com/matharuajay))
- Fogbugz 3426: Kill and restart the process in pm2 [\#88](https://github.com/EOSIO/eosio-explorer/pull/88) ([varshajnagaraja](https://github.com/varshajnagaraja))

**Fixed bugs:**

- Fogbugz 3442 - Handle docker volumes after restart [\#89](https://github.com/EOSIO/eosio-explorer/pull/89) ([matharuajay](https://github.com/matharuajay))

**Merged pull requests:**

- Doc: add Analytics section. [\#93](https://github.com/EOSIO/eosio-explorer/pull/93) ([terrylks](https://github.com/terrylks))
- Update README.md .. Fixed path: ~/.bash\_profile [\#87](https://github.com/EOSIO/eosio-explorer/pull/87) ([jcalfee](https://github.com/jcalfee))

## [v0.3.0](https://github.com/EOSIO/eosio-explorer/tree/v0.3.0) (2019-05-21)
[Full Changelog](https://github.com/EOSIO/eosio-explorer/compare/v0.3.0-beta.0...v0.3.0)

**Merged pull requests:**

- Added '0' to list of invalid numbers for account creation [\#86](https://github.com/EOSIO/eosio-explorer/pull/86) ([jcardenas9x](https://github.com/jcardenas9x))
- Release v0.3.0 and release to public. [\#77](https://github.com/EOSIO/eosio-explorer/pull/77) ([terrylks](https://github.com/terrylks))

## [v0.3.0-beta.0](https://github.com/EOSIO/eosio-explorer/tree/v0.3.0-beta.0) (2019-05-21)
[Full Changelog](https://github.com/EOSIO/eosio-explorer/compare/0.3.0-beta.0...v0.3.0-beta.0)

## [0.3.0-beta.0](https://github.com/EOSIO/eosio-explorer/tree/0.3.0-beta.0) (2019-05-21)
[Full Changelog](https://github.com/EOSIO/eosio-explorer/compare/0.3.0-beta...0.3.0-beta.0)

**Merged pull requests:**

- Internal: SKIP\_PREFLIGHT\_CHECK using create react app [\#85](https://github.com/EOSIO/eosio-explorer/pull/85) ([terrylks](https://github.com/terrylks))

## [0.3.0-beta](https://github.com/EOSIO/eosio-explorer/tree/0.3.0-beta) (2019-05-21)
[Full Changelog](https://github.com/EOSIO/eosio-explorer/compare/v0.3.0-beta...0.3.0-beta)

## [v0.3.0-beta](https://github.com/EOSIO/eosio-explorer/tree/v0.3.0-beta) (2019-05-21)
[Full Changelog](https://github.com/EOSIO/eosio-explorer/compare/v0.3.0-alpha.2...v0.3.0-beta)

**Implemented enhancements:**

- Apply different tag manager code based on node env [\#84](https://github.com/EOSIO/eosio-explorer/pull/84) ([matharuajay](https://github.com/matharuajay))
- Change name "Events" to "Console Log" for the logger panel. [\#82](https://github.com/EOSIO/eosio-explorer/pull/82) ([terrylks](https://github.com/terrylks))

**Fixed bugs:**

- Fix typos in the CLI help messages for individual commands [\#83](https://github.com/EOSIO/eosio-explorer/pull/83) ([jcardenas9x](https://github.com/jcardenas9x))
- Changed Github link in welcome popup to eosio-explorer repository [\#80](https://github.com/EOSIO/eosio-explorer/pull/80) ([mjk90](https://github.com/mjk90))

**Merged pull requests:**

- Update GTM ID [\#81](https://github.com/EOSIO/eosio-explorer/pull/81) ([matharuajay](https://github.com/matharuajay))
- Made revisions to README.md for proofing reasons [\#79](https://github.com/EOSIO/eosio-explorer/pull/79) ([jcardenas9x](https://github.com/jcardenas9x))
- adds wallet related legal rider [\#78](https://github.com/EOSIO/eosio-explorer/pull/78) ([josephjguerra](https://github.com/josephjguerra))

## [v0.3.0-alpha.2](https://github.com/EOSIO/eosio-explorer/tree/v0.3.0-alpha.2) (2019-05-20)
[Full Changelog](https://github.com/EOSIO/eosio-explorer/compare/0.3.0-alpha.2...v0.3.0-alpha.2)

## [0.3.0-alpha.2](https://github.com/EOSIO/eosio-explorer/tree/0.3.0-alpha.2) (2019-05-20)
[Full Changelog](https://github.com/EOSIO/eosio-explorer/compare/v0.3.0-alpha.1...0.3.0-alpha.2)

**Fixed bugs:**

- Fix problem where changing to mainnet/other connection and then changing back to local node did not update blockchain info [\#75](https://github.com/EOSIO/eosio-explorer/pull/75) ([jcardenas9x](https://github.com/jcardenas9x))

**Merged pull requests:**

- Added missing but required information  [\#76](https://github.com/EOSIO/eosio-explorer/pull/76) ([jcardenas9x](https://github.com/jcardenas9x))

## [v0.3.0-alpha.1](https://github.com/EOSIO/eosio-explorer/tree/v0.3.0-alpha.1) (2019-05-20)
[Full Changelog](https://github.com/EOSIO/eosio-explorer/compare/v0.3.0-alpha.0...v0.3.0-alpha.1)

**Implemented enhancements:**

- Change console logger notification background to blue and "Errors" to "Events" [\#71](https://github.com/EOSIO/eosio-explorer/pull/71) ([varshajnagaraja](https://github.com/varshajnagaraja))

**Fixed bugs:**

- Disabled button for hardcoded eosio account using our tool [\#73](https://github.com/EOSIO/eosio-explorer/pull/73) ([jcardenas9x](https://github.com/jcardenas9x))
- Fogbugz 3418: Connection indicator breaks when MongoDB gives connection error [\#70](https://github.com/EOSIO/eosio-explorer/pull/70) ([varshajnagaraja](https://github.com/varshajnagaraja))

**Merged pull requests:**

- Remove 9876 port from documentation [\#72](https://github.com/EOSIO/eosio-explorer/pull/72) ([jcardenas9x](https://github.com/jcardenas9x))

## [v0.3.0-alpha.0](https://github.com/EOSIO/eosio-explorer/tree/v0.3.0-alpha.0) (2019-05-17)
[Full Changelog](https://github.com/EOSIO/eosio-explorer/compare/v0.3.0-alpha...v0.3.0-alpha.0)

**Implemented enhancements:**

- Pm2 enhancement [\#68](https://github.com/EOSIO/eosio-explorer/pull/68) ([matharuajay](https://github.com/matharuajay))

**Fixed bugs:**

- Fix: Do not yarn install in init if the app is yarn global installed [\#69](https://github.com/EOSIO/eosio-explorer/pull/69) ([terrylks](https://github.com/terrylks))

## [v0.3.0-alpha](https://github.com/EOSIO/eosio-explorer/tree/v0.3.0-alpha) (2019-05-17)
[Full Changelog](https://github.com/EOSIO/eosio-explorer/compare/v0.2.2...v0.3.0-alpha)

**Implemented enhancements:**

- Show message to check log in case of error [\#67](https://github.com/EOSIO/eosio-explorer/pull/67) ([matharuajay](https://github.com/matharuajay))
- Fogbugz 3408: Replace 'loading...' with spinner [\#58](https://github.com/EOSIO/eosio-explorer/pull/58) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Allow users to update the public keys for their existing accounts [\#57](https://github.com/EOSIO/eosio-explorer/pull/57) ([jcardenas9x](https://github.com/jcardenas9x))
- Fogbugz 3391: Remove the whole Footer [\#54](https://github.com/EOSIO/eosio-explorer/pull/54) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Fogbugz 3398 - Use same pm2 to start the compiler service [\#53](https://github.com/EOSIO/eosio-explorer/pull/53) ([matharuajay](https://github.com/matharuajay))
- Fogbugz 3346 - Action history filter [\#52](https://github.com/EOSIO/eosio-explorer/pull/52) ([mjk90](https://github.com/mjk90))
- Added scope name to fetch multi-index table data [\#51](https://github.com/EOSIO/eosio-explorer/pull/51) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Performance fix in frontend for slow loading in mongodb [\#49](https://github.com/EOSIO/eosio-explorer/pull/49) ([terrylks](https://github.com/terrylks))
- Critical UI Fixes for Manage Accounts Page [\#48](https://github.com/EOSIO/eosio-explorer/pull/48) ([jcardenas9x](https://github.com/jcardenas9x))
- Fogbugz 3358: In react-snap prerendering, remove crawled \(/account/eosio\) [\#38](https://github.com/EOSIO/eosio-explorer/pull/38) ([varshajnagaraja](https://github.com/varshajnagaraja))

**Fixed bugs:**

- Fix a bug where prefilling an action with missing ABI breaks the push action page when revisiting it [\#66](https://github.com/EOSIO/eosio-explorer/pull/66) ([jcardenas9x](https://github.com/jcardenas9x))
- Fogbugz 3374 - Actions List timeout fix [\#64](https://github.com/EOSIO/eosio-explorer/pull/64) ([mjk90](https://github.com/mjk90))
- Fogbugz 3413: handle the url which contains '/' at the end [\#63](https://github.com/EOSIO/eosio-explorer/pull/63) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Fogbugz 3371: Help button should appear in front of all other buttons [\#61](https://github.com/EOSIO/eosio-explorer/pull/61) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Fixed issue where permission page breaks when connected to mainnet [\#59](https://github.com/EOSIO/eosio-explorer/pull/59) ([jcardenas9x](https://github.com/jcardenas9x))
- Fogbugz 3403 - Action history filter fix [\#56](https://github.com/EOSIO/eosio-explorer/pull/56) ([mjk90](https://github.com/mjk90))
- Performance fix in frontend for slow loading in mongodb [\#49](https://github.com/EOSIO/eosio-explorer/pull/49) ([terrylks](https://github.com/terrylks))
- Critical UI Fixes for Manage Accounts Page [\#48](https://github.com/EOSIO/eosio-explorer/pull/48) ([jcardenas9x](https://github.com/jcardenas9x))
- Fix: remove unused endpoint connect epic in push action page and bloc… [\#47](https://github.com/EOSIO/eosio-explorer/pull/47) ([terrylks](https://github.com/terrylks))
- Fogbugz 3378 - Add pm2 to run the application [\#46](https://github.com/EOSIO/eosio-explorer/pull/46) ([matharuajay](https://github.com/matharuajay))
- Fix drag and drop code viewer accepting .json files [\#45](https://github.com/EOSIO/eosio-explorer/pull/45) ([jcardenas9x](https://github.com/jcardenas9x))
- Fogbugz 3381 - Fixed create account validation [\#44](https://github.com/EOSIO/eosio-explorer/pull/44) ([mjk90](https://github.com/mjk90))
- Changed polling time to a global config, add timestamp to error log [\#43](https://github.com/EOSIO/eosio-explorer/pull/43) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Fix critical error where permission page breaks if currently not connected to any blockchain [\#42](https://github.com/EOSIO/eosio-explorer/pull/42) ([jcardenas9x](https://github.com/jcardenas9x))
- Included missing account name validation in create account panel [\#41](https://github.com/EOSIO/eosio-explorer/pull/41) ([jcardenas9x](https://github.com/jcardenas9x))
- Fix multiple argument issue with cli [\#39](https://github.com/EOSIO/eosio-explorer/pull/39) ([matharuajay](https://github.com/matharuajay))

**Merged pull requests:**

- Major documentation update, including main README updates [\#65](https://github.com/EOSIO/eosio-explorer/pull/65) ([jcardenas9x](https://github.com/jcardenas9x))
- Doc: author, contributors, description update. [\#62](https://github.com/EOSIO/eosio-explorer/pull/62) ([terrylks](https://github.com/terrylks))
- Rename EOSIO Explorer to EOSIO Labs™: EOSIO Explorer [\#60](https://github.com/EOSIO/eosio-explorer/pull/60) ([terrylks](https://github.com/terrylks))
- Remove warning in transaction detail page [\#55](https://github.com/EOSIO/eosio-explorer/pull/55) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Delete CODE\_OF\_CONDUCT.md [\#50](https://github.com/EOSIO/eosio-explorer/pull/50) ([josephjguerra](https://github.com/josephjguerra))
- labs badge and legal rider [\#40](https://github.com/EOSIO/eosio-explorer/pull/40) ([josephjguerra](https://github.com/josephjguerra))
- v0.2.2 release [\#37](https://github.com/EOSIO/eosio-explorer/pull/37) ([terrylks](https://github.com/terrylks))

## [v0.2.2](https://github.com/EOSIO/eosio-explorer/tree/v0.2.2) (2019-05-08)
[Full Changelog](https://github.com/EOSIO/eosio-explorer/compare/v0.2.1...v0.2.2)

**Implemented enhancements:**

- Fogbugz 3370: Polling should start immediately rather after 1st interval [\#36](https://github.com/EOSIO/eosio-explorer/pull/36) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Fogbugz 3304 - Add help and version to script files [\#35](https://github.com/EOSIO/eosio-explorer/pull/35) ([matharuajay](https://github.com/matharuajay))
- Update images to latest stable version. nodeos to v1.7.3 cdt to v1.6.1 [\#25](https://github.com/EOSIO/eosio-explorer/pull/25) ([terrylks](https://github.com/terrylks))
- Modified the 'SUBMIT' button text in Create Account panel to 'CREATE' [\#24](https://github.com/EOSIO/eosio-explorer/pull/24) ([jcardenas9x](https://github.com/jcardenas9x))
- Left align 'No. of Transactions' column in blocks list page [\#23](https://github.com/EOSIO/eosio-explorer/pull/23) ([varshajnagaraja](https://github.com/varshajnagaraja))
- FogBugz 3360 - Tidy up Permission Page by hiding Import Account Section if there are no accounts to import [\#22](https://github.com/EOSIO/eosio-explorer/pull/22) ([jcardenas9x](https://github.com/jcardenas9x))
- Removed TestRPCPage files and Routing [\#20](https://github.com/EOSIO/eosio-explorer/pull/20) ([mjk90](https://github.com/mjk90))
- Fogbugz 3339 - Reload button and error message changes [\#15](https://github.com/EOSIO/eosio-explorer/pull/15) ([mjk90](https://github.com/mjk90))
- Major UI and UX Updates to Deployment Page, other small fixes [\#12](https://github.com/EOSIO/eosio-explorer/pull/12) ([jcardenas9x](https://github.com/jcardenas9x))
- Fogbugz 3344, 3351, 3352, Capitalize all buttons [\#11](https://github.com/EOSIO/eosio-explorer/pull/11) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Fogbugz 3345: Remove button disabled for search button and capitalise [\#9](https://github.com/EOSIO/eosio-explorer/pull/9) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Fogbugz 3347 - Action Page UI Fixes [\#8](https://github.com/EOSIO/eosio-explorer/pull/8) ([matharuajay](https://github.com/matharuajay))
- Fogbugz 3348 - Account Page UI Changes [\#7](https://github.com/EOSIO/eosio-explorer/pull/7) ([matharuajay](https://github.com/matharuajay))
- add semicolon to connected mongodb label [\#5](https://github.com/EOSIO/eosio-explorer/pull/5) ([matharuajay](https://github.com/matharuajay))
- Fogbugz 3341 - Change header casing [\#4](https://github.com/EOSIO/eosio-explorer/pull/4) ([matharuajay](https://github.com/matharuajay))
- Update multi index table select label [\#2](https://github.com/EOSIO/eosio-explorer/pull/2) ([matharuajay](https://github.com/matharuajay))

**Fixed bugs:**

- Fogbugz 3342: Footer UI changes [\#33](https://github.com/EOSIO/eosio-explorer/pull/33) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Fogbugz 3369 - Fix PARAMS misspelling in reducers [\#32](https://github.com/EOSIO/eosio-explorer/pull/32) ([mjk90](https://github.com/mjk90))
- Fogbugz 3367, 3366: UI changes [\#30](https://github.com/EOSIO/eosio-explorer/pull/30) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Fogbugz 3365 - Drag drop responsive bug [\#29](https://github.com/EOSIO/eosio-explorer/pull/29) ([mjk90](https://github.com/mjk90))
- Fogbugz 3364: Route all 404 pages to dummy page for client side routing [\#28](https://github.com/EOSIO/eosio-explorer/pull/28) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Blocklist checkbox fix [\#27](https://github.com/EOSIO/eosio-explorer/pull/27) ([mjk90](https://github.com/mjk90))
- Fogbugz 3362: Grey border on Serach buttons- removed [\#26](https://github.com/EOSIO/eosio-explorer/pull/26) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Header CSS changes [\#21](https://github.com/EOSIO/eosio-explorer/pull/21) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Actionlist search error [\#19](https://github.com/EOSIO/eosio-explorer/pull/19) ([mjk90](https://github.com/mjk90))
- Adjustments to the deployment page on smaller sized browsers [\#18](https://github.com/EOSIO/eosio-explorer/pull/18) ([jcardenas9x](https://github.com/jcardenas9x))
- Fogbugz 3332, 3334 [\#17](https://github.com/EOSIO/eosio-explorer/pull/17) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Fogbugz 3339 - Reload button and error message changes [\#15](https://github.com/EOSIO/eosio-explorer/pull/15) ([mjk90](https://github.com/mjk90))
- Fogbugz 3354 - Remove warning from pages [\#14](https://github.com/EOSIO/eosio-explorer/pull/14) ([matharuajay](https://github.com/matharuajay))
- Major UI and UX Updates to Deployment Page, other small fixes [\#12](https://github.com/EOSIO/eosio-explorer/pull/12) ([jcardenas9x](https://github.com/jcardenas9x))
- Fogbugz 3333: Add styling to multi index data fetch error message [\#10](https://github.com/EOSIO/eosio-explorer/pull/10) ([varshajnagaraja](https://github.com/varshajnagaraja))

**Merged pull requests:**

- Rewrite and update documentation [\#34](https://github.com/EOSIO/eosio-explorer/pull/34) ([jcardenas9x](https://github.com/jcardenas9x))
- Adding git attr and code of conduct files to sync with eosio-toppings repo.  [\#16](https://github.com/EOSIO/eosio-explorer/pull/16) ([terrylks](https://github.com/terrylks))
- Doc: readme, license, contrib [\#13](https://github.com/EOSIO/eosio-explorer/pull/13) ([terrylks](https://github.com/terrylks))
- Doc update [\#6](https://github.com/EOSIO/eosio-explorer/pull/6) ([terrylks](https://github.com/terrylks))
- Internal: yarn lock updates [\#3](https://github.com/EOSIO/eosio-explorer/pull/3) ([terrylks](https://github.com/terrylks))

## [v0.2.1](https://github.com/EOSIO/eosio-explorer/tree/v0.2.1) (2019-05-03)
[Full Changelog](https://github.com/EOSIO/eosio-explorer/compare/eosio-explorer@0.2.1...v0.2.1)

## [eosio-explorer@0.2.1](https://github.com/EOSIO/eosio-explorer/tree/eosio-explorer@0.2.1) (2019-05-03)


\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*