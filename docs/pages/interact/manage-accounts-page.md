[Home](../..) > Manage Accounts Page

# Manage Accounts Page

In this page, you are able to get a listing of all the currently available accounts on the blockchain. When you start a local instance of nodeos, you will gain access to an `eosio` account which runs the EOSIO System Contracts which are responsible for important functions on the blockchain, including the creation of new accounts (via the `newaccount` action). You can create new accounts, update existing accounts or reset/clear all current permissions on this page. 

Note, permissions are listed one by one which means if the private key for one of the permissions of an account is lost, this permission will be shown in the "Import Account" section while the other permission will remain as a selectable permission for you to use or to to update.

## Available Actions

Above the two main panels in this page are buttons that allow you to perform various actions regarding account management.

To learn more about these panels, you can check the guide on managing accounts [here](../../guides/permissions).

### Create Account

Takes you to a new panel that allows you to create an account. Owner and active public and private key pairs will be generated for you in `base58 WIF` compliant format thanks to `eosjs-ecc`, allowing you to simply enter an account name that must follow the following rules:
1. Only consisting of the following characters: `.` (period), `[a-z]` (smallcaps alphabet) and `[1-5]` (numbers from 1 to 5) 
2. Only starting with `[a-z]` (smallcaps alphabet) or `[1-5]` (numbers from 1 to 5)

:warning: - This is because invalid characters like `[A-Z]` (uppercase alphabet), `[6-9]` (numbers from 6 to 9) and non period special characters will either be converted to `.` (period) or silently swallowed by the blockchain, so we prevent the user from using these characters to enhance the experience. 

Afterwards, click the "Submit" button and your account would be created successfully and be shown in the "Default Signature Account" panel. If there was an error, it will also be shown to you.

### Reset All Permissions

Upon first setup of this tool, the only account that should be in the "Default Signature Account" is the `eosio` account containing the EOSIO system contract. Adding new accounts or importing keys to accounts fetched from the PostgresDB will expand this list but otherwise, the default local storage state just contains the `eosio` account credentials. If you wish to clean out your local storage's state and re-initialize it to how it was before, click the "Reset All Permissions" button. A confirmation dialog will appear to ask you if you really wish to perform this operation. Click "Confirm" to go through with it, or click "Cancel" or outside of the dialog to cancel.

## Default Signature Account

This panel contains the currently available accounts which have both public and private keys for the owner and active permissions. These accounts can be used for signing transactions and authorizing actions. Accounts will be listed in pairs, corresponding to the owner and active permissions. By each permission is a radio button allowing you to indicate which permission should be the default one used to sign transactions. An "Edit" button per account is also available in case you wish to review your keys or if you would like to change the public keys for any given reason (for example, your private keys were compromised and you wish to change them right away).

## Import Account

The accounts in this panel do not have private keys assigned to them yet, whether it is both `owner` and `active` permissions or just one of them. You can click the "Import Keys" button to assign your private keys to these accounts. **Note**: Be sure that the private keys you import to the accounts here correspond to the public key fetched from the PostgresDB. Otherwise you won't be able to do anything with them, even if you import keys. 

## Import/Edit Account Panel

Accessible from clicking either "Edit" from the "Default Signature Account" panel or clicking "Import Keys" from the "Import Account" panel, you can paste in your private keys into the private key fields in this panel. If needed, you can also choose to change the public keys of your accounts in this panel (when clicking "Edit"). In this situation, please ensure that the public keys you use are `EOSKey` compliant. The `EOSKey` format is a public key format that is prefixed with the characters `EOS`. 

Furthermore, kindly ensure that the private keys you use are `base58 WIF` compliant. `WIF` stands for "Wallet Import Format" and is a convenience specification for copying and pasting private keys. The form will notify you if any of your keys are invalid upon submission. Please also ensure the private keys you import properly match the public keys listed here. Otherwise, you will not be able to authorize any actions with this account since the blockchain will not have the correct signatures for the declared authorization.

Your private keys will be saved locally in your browser. **However, please be sure NEVER to share your private key to anybody**. If someone asks you for your private key, please do not give it to them. Private keys are very sensitive information and should be kept to yourself as much as possible.

You can read more on how to use this panel by viewing the [guide on importing private keys](../../guides/permissions/import_account.md) or the [guide on updating your public keys](../../guides/permissions/update_account.md) 
