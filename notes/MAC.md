# Getting the pre-requisites

## Install Truffle

http://truffleframework.com/

```
npm install -g truffle
```

## Install Ganache

http://truffleframework.com/ganache/

## Starting a Truffle project

Next, let's create a Truffle project

```
truffle init
```

## Configure Truffle to talk to Ganache

In truffle.js

``` javascript
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "5777" // Match any network id
    }
  }
};

```

## Create the HelloWorld contract

Create contract by running this command

```
truffle create contract HelloWorld
```

You should see `HelloWorld.sol` in the `contracts` folder.

Now copy the code below to `HelloWorld.sol`

```
pragma solidity ^0.4.4;

contract HelloWorld {
  function HelloWorld() {
    // constructor
  }

  string private message;

  function getMessage () constant returns (string) {
    return message;
  }
  function setMessage(string newMessage) {
    message = newMessage;
  }
}
```

## Create the migration

To be able to use the contract, it needs to be deployed. To deploy, we need a migation.

To generate a migration, run this command

```
truffle create migration HelloWorld
```

In the generated migration file, copy the following in the migration.

```
const HelloWorld = artifacts.require('HelloWorld');
deployer.deploy(HelloWorld);
```

## Compile the contract

From your command line.

```
truffle compile
```

You should see this

```
Compiling ./contracts/HelloWorld.sol...
Compiling ./contracts/Migrations.sol...

Compilation warnings encountered:

/Users/zan/Projects/propine_capital/workshop_mac/contracts/HelloWorld.sol:4:3: Warning: No visibility specified. Defaulting to "public".
  function HelloWorld() {
  ^
Spanning multiple lines.
,/Users/zan/Projects/propine_capital/workshop_mac/contracts/HelloWorld.sol:10:3: Warning: No visibility specified. Defaulting to "public".
  function getMessage () constant returns (string) {
  ^
Spanning multiple lines.
,/Users/zan/Projects/propine_capital/workshop_mac/contracts/HelloWorld.sol:13:3: Warning: No visibility specified. Defaulting to "public".
  function setMessage(string newMessage) {
  ^
Spanning multiple lines.

Writing artifacts to ./build/contracts
```

## Deploying your contract

From your command line

```
truffle deploy
```

You should see this

```
Using network 'development'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x9ea49ab6054c58aefd8cc63fd7c4f342122cf4550afdaba03d0ca8fd3718f38c
  Migrations: 0xc7bcf2c0040e703cef3b21744626b4b1e15946a7
Saving successful migration to network...
  ... 0xaaba2e2a17dadcad27191be8a9fcf41da957139fe171e984819d4e8d08828fc1
Saving artifacts...
Running migration: 2_hello_world_migration.js
  Deploying HelloWorld...
  ... 0x047f754db47490d192895a57c6442bbddd287e4b8686f6206c6ecb79bb3090a7
  HelloWorld: 0x6c9c99401b4442bbe010a0575aed20c9658009bc
Saving successful migration to network...
  ... 0x0d0c176956ad7bab006d8d78913d7cdbcef2eb6dd6fbe31d0df98231f40793d0
Saving artifacts...
```

## Interacting with the contract

Open up the console, by typing the following command

```
truffle console
```

### Viewing the accounts

At the console, type the following command

``` javascript
web3.eth.accounts
```

You should see the following

``` javascript
[ '0x17484326fc7b21c7cb23f471e87e031052ef3530',
  '0x591186754f694586ead9664a896fdf192d11602c',
  '0xe5a0eee899cf77aaab73ee06e9f115128375e9c5',
  '0x966f12be8b8726f3febdc352efc334292efb1878',
  '0x9e2df31f4d4f286e1ae65265db6d6b2a73653dab',
  '0x04d82a4a0ebaedf3b5dc821cd75567166f4655e7',
  '0x884f54143b1a567d9df72346f1ecaf574bf9688a',
  '0x3de4ffb7d25f12204769e9ea302fa6bca4f83a9c',
  '0xa41fd192e775685b0c9cf9b187458073b19a2234',
  '0xaa0b14a5661bc1016d115e24d0e061ce26b6386d' ]
```

### Viewing the deployed contract

At the truffle console, type the following command

``` javascript
HelloWorld.deployed()
```

You should see the following

```
TruffleContract {
  constructor:
   { [Function: TruffleContract]
     _static_methods:
      { setProvider: [Function: setProvider],
        new: [Function: new],
        at: [Function: at],
        deployed: [Function: deployed],
        defaults: [Function: defaults],
        hasNetwork: [Function: hasNetwork],
        isDeployed: [Function: isDeployed],
        detectNetwork: [Function: detectNetwork],
        setNetwork: [Function: setNetwork],
        resetAddress: [Function: resetAddress],
        link: [Function: link],
        clone: [Function: clone],
        addProp: [Function: addProp],
        toJSON: [Function: toJSON] },
...
```

### Viewing the initial message

At the truffle console, type the following command

``` javascript
HelloWorld.deployed().then(function(instance){contract = instance})
```

You should get this

```
undefined
```

We are setting a variable called `contract` that points to the instance of the contract.

To see the initial message, run the following command

```
contract.getMessage.call()
```

You should see an empty string

```
''
```

### Setting a message

At the truffle console, type the following command

```
contract.setMessage("New Test Message")
```

You should see this

``` javascript
{ tx: '0x2fe5f512c5477434fd943c8bff3316fb8e5638ae798613695fd90615aaa67c73',
  receipt:
   { transactionHash: '0x2fe5f512c5477434fd943c8bff3316fb8e5638ae798613695fd90615aaa67c73',
     transactionIndex: 0,
     blockHash: '0x05b413c41211a245236eb496070d843e4bec09c99bface17913ef3e9e6c68141',
     blockNumber: 5,
     gasUsed: 43679,
     cumulativeGasUsed: 43679,
     contractAddress: null,
     logs: [],
     status: '0x01',
     logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' },
  logs: [] }
```

### Viewing the new message

At the truffle console, type the following command

```
contract.getMessage.call()
```

You should see this

```
'New Test Message'
```

## Connecting to Testnet

Switch to use this configuration to connect to Testnet

```
development: {
  host: "13.229.195.247",
  port: 8545,
  network_id: "2"
}
```
