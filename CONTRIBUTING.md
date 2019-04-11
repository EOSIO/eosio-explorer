# Contributing

Contributions are always welcome.

# Publishing

Right before making a PR which merge develop into master for a release, the maintainer of this repository should use `lerna` cli to version and push the publishing commit and tags.

Steps:
1. In your local, make sure you are in develop branch and pulled the latest code.
2. Run `lerna version` and update the version number of each of the packages.
   - Ref: https://github.com/lerna/lerna/tree/master/commands/version#readme
3. Lerna will commit a publishing commit and tag with all updated version number of each of the packages and push to git origin automatically.

You can now create a PR to merge from develop into master with the updated versioning in packages and tags in git.
