# Change Log

## [v0.2.2](https://github.com/EOSIO/eosio-explorer/tree/v0.2.2) (2019-05-08)
[Full Changelog](https://github.com/EOSIO/eosio-explorer/compare/v0.2.1...v0.2.2)

# Highlights

* First new release for eosio-explorer as a standalone repository
* Mostly UI / UX enhancement
* Much more detail documentation
* Update @eosio-toppings dependencies to v0.2.2 for
  * updating to use latest stable version of eosio (v1.7.3) and eosio-cdt ( v1.6.1 ) in dockers
  * Better documentation

**Implemented enhancements:**

- Fogbugz 3370: Polling should start immediately rather after 1st interval [\#36](https://github.com/EOSIO/eosio-explorer/pull/36) ([varshajnagaraja](https://github.com/varshajnagaraja))
- Fogbugz 3304 - Add help and version to script files [\#35](https://github.com/EOSIO/eosio-explorer/pull/35) ([matharuajay](https://github.com/matharuajay))
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
- Update images to latest stable version. nodeos to v1.7.3 cdt to v1.6.1 [\#25](https://github.com/EOSIO/eosio-explorer/pull/25) ([terrylks](https://github.com/terrylks))
- Adding git attr and code of conduct files to sync with eosio-toppings repo.  [\#16](https://github.com/EOSIO/eosio-explorer/pull/16) ([terrylks](https://github.com/terrylks))
- Doc: readme, license, contrib [\#13](https://github.com/EOSIO/eosio-explorer/pull/13) ([terrylks](https://github.com/terrylks))
- Doc update [\#6](https://github.com/EOSIO/eosio-explorer/pull/6) ([terrylks](https://github.com/terrylks))
- Internal: yarn lock updates [\#3](https://github.com/EOSIO/eosio-explorer/pull/3) ([terrylks](https://github.com/terrylks))

## [v0.2.1](https://github.com/EOSIO/eosio-explorer/tree/v0.2.1) (2019-05-03)


\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*
