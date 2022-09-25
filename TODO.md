# My Precious Web3 Wallet

My Precious is the best web3 voice wallet out there.

## TODO

- [x] Add a way to check a wallet's native ETH balance given an address (hardcoded)
- [ ] Get the user wallet address
- [ ] Get the user wallet native balance using user address

## Features

- [ ] Capture the wallet address of the alexa user
- [ ] Check native balance
- [ ] Check ERC20 balance

## Build from scratch

During the build, a few files and changes were made to be specific to that particular alexa dev user.

When we put it into github for others to consume and build we need to remove:
- .ask/ask-states.json
- ./ask/lambda/*
- in ./skill-package.json/skill.json remove the "endpoint" section under "manifest.apis.custom". 
i.e set 
```
"apis": {
      "custom": {}
      }
```
Once the above is done, a new developer can just do ask init and deploy the skill to their own locations.