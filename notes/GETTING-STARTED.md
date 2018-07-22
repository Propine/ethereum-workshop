# Hello World... we will exchange ether

## Development (Part 2)
   Part 1 of Development is at [here (MAC)](MAC.md) or [here (WINDOWS)](WINDOWS.md)

### Deploying to testnet

In this part we will deploy truffle contract to Ropsten test server and attempt to exchange ether.

* Instead of running the Ropsten testnet locally, we will use a remote testnet

* Launch PowerShell
* In the command line, enter this
  ```
  geth attach http://13.229.195.247:8545
  ```
  You should see that Geth is running

* If this is your first time in this testnet, create your own account. Type the following command in the Geth Javascript console:
  ```
  personal.newAccount("AwesomePassphrase")
  ```
  (Substitute `AwesomePassphrase` with your own passphrase)

  You should see something like this:
  ```
  "0xa8390083b22754a247a6b61b8b9f33ac85aaff88"
  ```
  This is your account address. Copy from the console and note it down as we will be using it later on.

* Fund the account using faucet
  - Go to http://faucet.ropsten.be:3001/
  - Enter your account address (The "0x..." string from previous step)
  - Click "Send me 1 test ether!"

* Check your account
  - Go to https://ropsten.etherscan.io/
  - Search for your address
  - Click the link under TxHash
  - You should see some ether transfer in progress or even completed
  - Note the gas limit here. (In my case it is `314150`)

* We will attempt to deploy contract from part 1 first.

* Edit the truffle.js to add the following configuration
  ```
  ropsten: {
    host: "13.229.195.247",
    port: 8545,
    network_id: "3",
    from: "0x....", // your account address from previous step
    gas: 314150
  }
  ```

* Go back to Geth console and unlock the account.
  This time we will define duration of unlock to keep it unlocked for a longer while.
  ```
  personal.unlockAccount("0x...your account address ...", "AwesomePassphrase", 600)
  ```
  600 = 10 minutes.
  You should see
  ```
  true
  ```

* Launch another PowerShell
  Go to your code directory

* Type and run following command
  ```
  truffle compile
  ```

* Followed by
  ```
  truffle migrate --network ropsten --reset
  ```

* You should see something like this
  ```
  Using network 'ropsten'.

  Running migration: 1_initial_migration.js
    Deploying Migrations...
    ... 0x02e77b1ae6fa303a80fd9a2bdffed1c9cd46b19f40498ed3c77f79d35d0f3612
    Migrations: 0xc593bc1a1b7c6927f07979f87a69afa1873de44e
  Saving successful migration to network...
    ... 0x41126df0820900c8b169c4e18ba94f80ca9b12b7d345c1b546cde613c2c901d3
  Saving artifacts...
  Running migration: 1523804593_hello_world.js
    Deploying HelloWorld...
    ... 0x923716a274615ee2acea556b81ea18c2c153947bf99a22c25dae5ea79feed08b
    HelloWorld: 0x6f8fc170cbedbfa9f0245a0bbd03ff4c2f602f44
  Saving successful migration to network...
    ... 0xa70a451f4639eb8bdc3d8c366aad657fc59057da2c0cecfe855da105a0147e9e
  Saving artifacts...
  ```

* If there is error, note the error message. Here are common causes and ways to troubleshoot gas limit error:
  https://hanezu.github.io/posts/Gas-Limit-Error-when-deploy-Truffle-project-on-Private-Network.html

  For example:
  ```
  Using network 'ropsten'.

  Running migration: 1_initial_migration.js
    Deploying Migrations...
    ... undefined
  Error encountered, bailing. Network state unknown. Review successful transactions manually.
  Error: authentication needed: password or unlock
      at Object.InvalidResponse (C:\Users\user\AppData\Roaming\npm\node_modules\truffle\build\webpack:\~\web3\lib\web3\errors.js:38:1)
  ...
  ```
  Note the error `Error: authentication needed: password or unlock`. Which means we have to unlock the account in Geth Javascript console.

* Check your account at https://ropsten.etherscan.io/
  You should see some transactions happening.

* To exit the ropsten testnet, type and run
  ```
  exit
  ```

### Add ether exchange feature

* In this section, we will write code to transfer ether to another account

* In the same code directory, create new contract
  ```
  truffle create contract SimpleTransfer
  ```
* Open the SimpleTransfer.sol

* We will first define parties involved, amount and a status flag parameters just after the contract definition like so,
  ```
  contract SimpleTransfer {
    address public payer;
    address public beneficiary;
    uint public amount;
    bool ready;
    ...
  ```

* After the parameters, define events (They are simply logs)
  ```
  event PayInitiate(address payer, uint transacted);
  event TransferCompleted(address beneficiary, uint transacted);
  ```

* Set the `ready` flag in constructor
  ```
  function SimpleTransfer() public {
    // constructor
    ready = false;
  }
  ```

* Then add the functions to prepare the payment and to do the transfer
  ```
  function pay(address receiver) public payable {
    payer = msg.sender;
    amount = msg.value;
    beneficiary = receiver;
    ready = true;
    emit PayInitiate(payer, amount);
  }

  function doTransfer() public {
    require(ready);
    beneficiary.transfer(amount);
    emit TransferCompleted(beneficiary, amount);
  }
  ```

* The whole code can be seen in SimpleTransfer.sol in github

* Save the changes, then go to PowerShell and run:
  ```
  truffle create migration SimpleTransfer
  ```

* A migration file should be generated under `migrations`. The file name should be similar to this `1524420214_simple_transfer.js`
* Open it and put this:
  ```
  module.exports = function(deployer) {
    // Use deployer to state migration tasks.
    const SimpleTransfer = artifacts.require('SimpleTransfer');
    deployer.deploy(SimpleTransfer);
  };
  ```

* You may need to increase gas limit in truffle.js as the transfer will require higher limit. Note that the transaction will not use up the whole gas. It is just a limit to be set.
* Current truffle.js
  ```
  ropsten: {
    host: "13.229.195.247",
    port: 8545,
    network_id: "3",
    from: "0x....", // your account address
    gas: 614150   // arbitrary value
  }
  ```

* Make sure you are connected to ropsten server. If not, launch PowerShell and enter this command.
  ```
  geth attach http://13.229.195.247:8545
  ```
* Ensure your account is unlocked

* At truffle shell, run this
  ```
  truffle compile
  ```
  You should see
  ```
  Compiling .\contracts\EtherExchange.sol...
  Writing artifacts to .\build\contracts
  ```

* Then run this to deploy to network
  ```
  truffle migrate --network ropsten --reset
  ```
  You should see
  ```
  Using network 'ropsten'.

  Running migration: 1_initial_migration.js
    Replacing Migrations...
    ... 0xb804abcf4ba1860a3b772cd50e2bfd872795f12fd6a9ad506b6a4dc62e03692d
    Migrations: 0xac38cbfe07f26ab2d345665dbfa8cc0f24878d45
  Saving successful migration to network...
    ... 0xf0701e8e0a726e0d0f86b37a0445f80b6e492b29803eaa5af473304219edbe92
  Saving artifacts...
  Running migration: 1523804593_hello_world.js
    Deploying HelloWorld...
    ... 0x3684a2170b126665c3ff85e5e904bbf2edc406f59b120146b62abf5355ed4ffc
    HelloWorld: 0x557205a2cfcbf666b1a0f940aad5dbb2439f5136
  Saving successful migration to network...
    ... 0x6a45fc649286a71c830ecee17a1c76e4eea67049358ce096493ca69d0cd58e81
  Saving artifacts...
  ```
  Note:
  - this process takes some time. You may want to move the initial_migration and hello_world migration files elsewhere to save gas and time.
  - you may need to unlock account from time to time. Alternatively, set a longer duration when unlocking account.

* After deployment, launch the console to interact with contract
  ```
  truffle console --network ropsten
  ```

* First check that deployment is successful
  ```
  SimpleTransfer.deployed()
  ```

* Then instantiate
  ```
  SimpleTransfer.deployed().then(inst => { transfer = inst })
  ```
  Expect to see
  ```
  Undefined
  ```

* We will try to transfer ether. So get the account address you want to transfer to.
  For example,
  ```
  0xdfdd84b8Be2005Ca321FF70E15136eF7896ABe0B
  ```

* Then copy following to truffle console.
  ```
  transfer.pay("0xdfdd84b8Be2005Ca321FF70E15136eF7896ABe0B", {value: web3.toWei(0.0000001, "ether")})
  ```
  (Set the ether amount to any amount you want, but ensure they are under 1 ether for this experiment)

* You should see successful transaction with message similar to this,
  ```
  { tx: '0x2338cd3727b60b189c7c5ba345c679c09bb7153cab1ef912f3bc2db202e6c4b9',
  receipt:
   { blockHash: '0x9e6778da994740918b3cc51588d5be5a97fcfef09d2b032ba6a6de5333b4c116',
     blockNumber: 3088876,
     contractAddress: null,
     cumulativeGasUsed: 71666,
     from: '0xc... your account address...',
     gasUsed: 45435,
     logs: [ [Object] ],
     logsBloom: '0x00000000000020000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000080000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000',
     status: '0x1',
     to: '0x1edad54eb26816eec063ecb03fb0815e148a8eac',
     transactionHash: '0x2338cd3727b60b189c7c5ba345c679c09bb7153cab1ef912f3bc2db202e6c4b9',
     transactionIndex: 1 },
  logs:
   [ { address: '0x1edad54eb26816eec063ecb03fb0815e148a8eac',
       blockNumber: 3088876,
       transactionHash: '0x2338cd3727b60b189c7c5ba345c679c09bb7153cab1ef912f3bc2db202e6c4b9',
       transactionIndex: 1,
       blockHash: '0x9e6778da994740918b3cc51588d5be5a97fcfef09d2b032ba6a6de5333b4c116',
       logIndex: 0,
       removed: false,
       event: 'PayInitiate',
       args: [Object] } ] }
  ```
* Note the tx number. Find it in https://ropsten.etherscan.io/

* If all looking good, we will do the transfer
  ```
  transfer.doTransfer()
  ```
  Expect to see something like this,
  ```
  { tx: '0xad87debb98aa828b554edf67df9aab840f005b55639fe28fb0396824468defee',
  receipt:
   { blockHash: '0x9fcf2962a1dd88186a4cfc647303fd0440ae1938fe5ad06ad53f96728b39fb31',
     blockNumber: 3088892,
     contractAddress: null,
     cumulativeGasUsed: 31429,
     from: '0xc... your account address...',
     gasUsed: 31429,
     logs: [ [Object] ],
     logsBloom: '0x00000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000',
     status: '0x1',
     to: '0x1edad54eb26816eec063ecb03fb0815e148a8eac',
     transactionHash: '0xad87debb98aa828b554edf67df9aab840f005b55639fe28fb0396824468defee',
     transactionIndex: 0 },
  logs:
   [ { address: '0x1edad54eb26816eec063ecb03fb0815e148a8eac',
       blockNumber: 3088892,
       transactionHash: '0xad87debb98aa828b554edf67df9aab840f005b55639fe28fb0396824468defee',
       transactionIndex: 0,
       blockHash: '0x9fcf2962a1dd88186a4cfc647303fd0440ae1938fe5ad06ad53f96728b39fb31',
       logIndex: 0,
       removed: false,
       event: 'TransferCompleted',
       args: [Object] } ] }
  ```
* It should be in https://ropsten.etherscan.io/ as well
* Note that if you are looking at recipient account address in etherscan, the transaction will be listed under `Internal Transactions` tab