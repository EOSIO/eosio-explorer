[Home](../..) > Push Action Page

# Push Action Page

When you wish to test whether the actions you have implemented in your smart contract work, you can push actions from this page. The Push Actions Page is composed of two panels, one for specifying the action you wish to push as well as its payload, and one for pre-filling the first panel with information of previously pushed actions. 

The page will attempt to search for all available smart contracts, then allowing you to select which of them you wish to perform actions from. After selecting a specific contract, you can then select the action type you want to push. You can also specify a certain permission or actor to authorize the action. 

## Push Action 

In this panel, you can fully specify the manner in which you wish to push an action. There are four required things to specify in this panel:

1. The smart contract containing the action you wish to pull
2. The specific action from the smart contract
3. The permission/actor who will sign the action
4. The payload containing arguments corresponding to the parameters of the action

The most basic example, for instance, of a `HelloWorld` smart contract with only one action named `Greet` and requesting of one 
