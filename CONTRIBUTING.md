# Contributing

Contributions are always welcome. We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

# Open Development

All work on Eosio Explorer happens directly on GitHub. Both core team members and external contributors send pull requests which go through the same review process.

# Branch Organization

We aim to keep the master branch stable so if you create a pull request, please do it against the `develop branch`. We maintain stable branches for major versions separately but we don’t accept pull requests to them directly. Instead, we cherry-pick non-breaking changes from master to the latest stable major version.

# Bugs

If you would like to report a bug, please use [GitHub Issues](https://github.com/EOSIO/eosio-toppings/issues/new). Before filing a new issue, please check if it has already been reported.

# Proposing a Change

If you intend to change the public API or make any non-trivial changes to the implementation, we recommend filing an issue. This lets us reach an agreement on your proposal before you put significant effort into it.

If you’re only fixing a bug, it’s fine to submit a pull request right away but we still recommend to file an issue detailing what you’re fixing. This is helpful in case we don’t accept that specific fix but want to keep track of the issue.

# Sending a Pull Request

The core team is monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation. For API changes we may need to fix our internal uses, which could cause some delay. We’ll do our best to provide updates and feedback throughout the process.

# Publishing

Right before making a PR which merge develop into master for a release, the maintainer of this repository should use `lerna` cli to version and push the publishing commit and tags.

Steps:
1. In your local, make sure you are in develop branch and pulled the latest code.
2. Run `lerna version` and update the version number of each of the packages.
   - Ref: https://github.com/lerna/lerna/tree/master/commands/version#readme
3. Lerna will commit a publishing commit and tag with all updated version number of each of the packages and push to git origin automatically.

You can now create a PR to merge from develop into master with the updated versioning in packages and tags in git.

# License

By contributing to React, you agree that your contributions will be licensed under its MIT license.