## ICO

* We will follow up on [previous ICO exercise](ICO-1.md)

Ref: https://blog.zeppelin.solutions/how-to-create-token-and-initial-coin-offering-contracts-using-truffle-openzeppelin-1b7a5dae99b6

### Crowdsale your Token

* The opening time was hardcoded in the migration script `1527439956_my_token_crowdsale.js` previously. So we will replace the openingTime to be more dynamic.
  ```
  const openingTime = Math.round((new Date(Date.now() + 180000).getTime())/1000);  // 180000 ms = 3 mins in future
  ```
  Note:
  * The openingTime may affect subsequent tests, so do not set it too far in the future

* No changes in contracts, so do not need to compile.

* We will connect to Ropsten testnet as in previous exercise.
  The steps are as follow:
  1. Launch PowerShell
  2. enter `geth attach http://13.229.195.247:8545`

* Once you are in the geth console, unlock your account.
  ```
  personal.unlockAccount("0x...your account address ...", "AwesomePassphrase", 600)
  ```

  Note:
  * If need to, request funding using faucet

* For this experiment, ideally we have two accounts in the testnet. One will be our personal account which will act as investor (buyer). Another one will be used as wallet for the contract. If you haven't, create the second account then note the address.

* Use this second account as wallet in `1527439956_my_token_crowdsale.js`
  for example,
  ```
  const wallet = '0x6147201d01d6cbb9584d97aa7f000e0ee32b01af';
  ```

* Deploy the Token and Crowdsale using newly edited migration script. In code terminal/ console (PowerShell etc):
  ```
  truffle migrate --network ropsten --reset
  ```

  The deployment will take some time as usual.
  When it is done, you should see something like this:
  ```
  Using network 'ropsten'.

  Running migration: 1527439956_my_token_crowdsale.js
    Running step...
    Replacing MyToken...
    ... 0x7ce49d875bfc60f1fa01f31a0837153464b9dafb732626efa4a6a0ca42f1089d
    MyToken: 0x582eb28b1d80ebe08cd1d7f8d2aaf4b5da567905
    Replacing MyTokenCrowdsale...
    ... 0x35bd54707e296618170a44372a51e496775c70ed7e55a2d64f91d0b4db173abb
    MyTokenCrowdsale: 0xf258fe5d859b28b4909c9597f51fbcd048f38c21
  Saving artifacts...
  ```

* Again, check your account at https://ropsten.etherscan.io/ to verify transactions.
  The addresses in the transactions should correspond to the addresses given in the migration.

* Go back to the code console and run this.
  ```
  truffle console --network ropsten
  ```

* In the truffle console, we will redo previous API scripts quickly.
  ```
  purchaser = "0x...your account address ..."
  ```
  Use the account of person who wants to purchase your token (it can be your own account). We will need to unlock the purchaser account later, so you need to ensure you know the passphrase.

  ```
  MyTokenCrowdsale.deployed().then(inst => { crowdsale = inst })
  ```
  ```
  crowdsale.token().then(addr => { tokenAddress = addr } )
  ```
  ```
  tokenAddress
  ```
  Expect to see your Token address. In my example I see:
  ```
  '0x582eb28b1d80ebe08cd1d7f8d2aaf4b5da567905'
  ```
  ```
  myTokenInstance = MyToken.at(tokenAddress)
  ```

* We will now attempt the sale.

* Change token ownership to crowdsale so it is able to mint tokens during crowdsale
  ```
  myTokenInstance.transferOwnership(crowdsale.address)
  ```
  Expect to see something like this.
  ```
  { tx: '0x258e73fe4e44f5a59bf8a614e964b58cfb2e6dcf100f2935507f679a2b0d3ca6',
    receipt:
     { blockHash: '0xc7fe4f83e444dd4a98bcaa6bcc6116913e1c2f2e2706f9a5e26edc4190d706f5',
       blockNumber: 3410681,
       contractAddress: null,
       cumulativeGasUsed: 30548,
       from: '0xb28f29e29e61dfd6d1af9d035e5d3d6598b536ea',
       gasUsed: 30548,
       logs: [ [Object] ],
       logsBloom: '0x00000000000000008000000000000000000000000000400000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000402000000000000000000000000004000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000020000000000000000000000000000000000000008000000000000',
       status: '0x1',
       to: '0x582eb28b1d80ebe08cd1d7f8d2aaf4b5da567905',
       transactionHash: '0x258e73fe4e44f5a59bf8a614e964b58cfb2e6dcf100f2935507f679a2b0d3ca6',
       transactionIndex: 0 },
    logs:
     [ { address: '0x582eb28b1d80ebe08cd1d7f8d2aaf4b5da567905',
         blockNumber: 3410681,
         transactionHash: '0x258e73fe4e44f5a59bf8a614e964b58cfb2e6dcf100f2935507f679a2b0d3ca6',
         transactionIndex: 0,
         blockHash: '0xc7fe4f83e444dd4a98bcaa6bcc6116913e1c2f2e2706f9a5e26edc4190d706f5',
         logIndex: 0,
         removed: false,
         event: 'OwnershipTransferred',
         args: [Object] } ] }
  ```
  Note:
  * This will take a while
  * Note the `event: 'OwnershipTransferred'` that indicates transfer is successful
  * If you get this error `Error: authentication needed: password or unlock`, simply unlock your personal account

* Check the number of MyToken held by purchaser
  ```
  myTokenInstance.balanceOf(purchaser).then(balance => balance.toString(10))
  ```
  Expect to see
  ```
  '0'
  ```
  Note: if you get `ReferenceError: purchaser is not defined`, just redefine `purchaser` as stated earlier in this exercise

* Ensure purchaser account is unlocked in Ropsten testnet as well

* Purchaser will buy MyToken now. Example of purchasing 0.01 ether worth:
  ```
  MyTokenCrowdsale.deployed().then(inst => inst.sendTransaction({ from: purchaser, value: web3.toWei(0.01, "ether")}))
  ```
  Expect to see
  ```
  { tx: '0x645c3bcedef9930ca63abc125d7c0225d1dd0e9b0287d8dcd0cb98fe52e57aa3',
    receipt:
     { blockHash: '0x7d107fb77284bc1fc6cfff9c08067a9e0e9a65ad97ef0c0135af2e83f971e96c',
       blockNumber: 3410698,
       contractAddress: null,
       cumulativeGasUsed: 521890,
       from: '0xe0e7b2911615a568524bd3d6ec2bc38f8fb86dab',
       gasUsed: 99395,
       logs: [ [Object], [Object], [Object] ],
       logsBloom: '0x00000000000000008000000000000000200000004000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000008000000000000000000000000000000000000000000000000020000000000000000000800000000000000400000000010000000040000000000000000000000000004000000000000000000000058000000000000000080000000000000000000000000000000000000000000000000000000000000000002080000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000020000000000000000080',
       status: '0x1',
       to: '0xf258fe5d859b28b4909c9597f51fbcd048f38c21',
       transactionHash: '0x645c3bcedef9930ca63abc125d7c0225d1dd0e9b0287d8dcd0cb98fe52e57aa3',
       transactionIndex: 3 },
    logs:
     [ { address: '0xf258fe5d859b28b4909c9597f51fbcd048f38c21',
         blockNumber: 3410698,
         transactionHash: '0x645c3bcedef9930ca63abc125d7c0225d1dd0e9b0287d8dcd0cb98fe52e57aa3',
         transactionIndex: 3,
         blockHash: '0x7d107fb77284bc1fc6cfff9c08067a9e0e9a65ad97ef0c0135af2e83f971e96c',
         logIndex: 5,
         removed: false,
         event: 'TokenPurchase',
         args: [Object] } ] }
  ```
  Note the event again.

* Check the purchaser's amount of MyToken.
  ```
  myTokenInstance.balanceOf(purchaser).then(balance => purchaserMyTokenBalance = balance.toString(10))
  ```
  Expect to see (for purchase of 0.01 MOT):
  ```
  '10000000000000000'
  ```

* Our token was set with 18 decimals, which is the same as what ether has. That's why there are a lot of zeros in the balance above. To see the balance without the decimals, run this:
  ```
  web3.fromWei(purchaserMyTokenBalance, "ether")
  ```
  Expect to see (for purchase of 0.01 MOT):
  ```
  '0.01'
  ```

### Adding refund features

* Refund features are useful for cases like for example,
  * token purchases limit reached and we have to refund purchases done after that
  * ICO does not meet minimum requirement and has to be cancelled

* In this exercise we will do a simple refund feature.
  We will utilise Open-Zeppelin RefundableCrowdsale instead of reinventing the wheel.

* Open `MyTokenCrowdsale.sol`
  * Remove `TimedCrowdsale` and add `FinalizableCrowdsale`, `RefundableCrowdsale` libs like this:
  ```
  import 'zeppelin-solidity/contracts/crowdsale/distribution/FinalizableCrowdsale.sol';
  import 'zeppelin-solidity/contracts/crowdsale/distribution/RefundableCrowdsale.sol';
  import 'zeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol';

  ```

  * Inherit it in `MyTokenCrowdsale` like so,
  ```
  contract MyTokenCrowdsale is RefundableCrowdsale, MintedCrowdsale {
  ```

  * Edit the constructor,
  ```
    function MyTokenCrowdsale
    (
      uint256 _openingTime,
      uint256 _closingTime,
      uint256 _rate,
      address _wallet,
      uint256 _goal,
      MintableToken _token
    )
    public
    Crowdsale(_rate, _wallet, _token)
    TimedCrowdsale(_openingTime, _closingTime)
    FinalizableCrowdsale()
    RefundableCrowdsale(_goal)
    {
      // constructor
    }
  ```

  And add requirement such that the whole source should end up like this:
  ```
  pragma solidity ^0.4.4;

  import './MyToken.sol';
  import 'zeppelin-solidity/contracts/crowdsale/distribution/FinalizableCrowdsale.sol';
  import 'zeppelin-solidity/contracts/crowdsale/distribution/RefundableCrowdsale.sol';
  import 'zeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol';

  contract MyTokenCrowdsale is RefundableCrowdsale, MintedCrowdsale {
    function MyTokenCrowdsale
    (
      uint256 _openingTime,
      uint256 _closingTime,
      uint256 _rate,
      address _wallet,
      uint256 _goal,
      MintableToken _token
    )
    public
    Crowdsale(_rate, _wallet, _token)
    TimedCrowdsale(_openingTime, _closingTime)
    FinalizableCrowdsale()
    RefundableCrowdsale(_goal)
    {

    }

  }
  ```

* We will edit the migration script to this.
  For testing refund, the end time is intentionally set to 20 minutes after opening time.
  ```
  const MyTokenCrowdsale = artifacts.require('./MyTokenCrowdsale.sol');
  const MyToken = artifacts.require('./MyToken.sol');

  module.exports = function(deployer, network, accounts) {
    const openingTime = Math.round((new Date(Date.now() + 180000).getTime())/1000);  // 180000 ms = 3 mins in future
    const closingTime = openingTime + 1200; // 86400 * 20; // 20 days
    const rate = new web3.BigNumber(1);
    const wallet = '0x6147201d01d6cbb9584d97aa7f000e0ee32b01af'; // substitute with your wallet address

    return deployer
      .then(() => {
          return deployer.deploy(MyToken);
      })
      .then(() => {
          return deployer.deploy(
              MyTokenCrowdsale,
              openingTime,
              closingTime,
              rate,
              wallet,
              2000000000000000000, // Goal: 2 ETH
              MyToken.address
          );
      });
  };
  ```

* ```
  truffle compile
  ```
  ```
  truffle migrate --network ropsten --reset
  ```
  Expect to see:
  ```
  Using network 'ropsten'.

  Running migration: 1527439956_my_token_crowdsale.js
    Running step...
    Replacing MyToken...
    ... 0xec205eb30a22f2539d5c43353f6ea32422bb62e4ec4cfb6c813199d2f33a553c
    MyToken: 0x5ec58d8208ca8f9a19ea919bb935bc1d50fac329
    Replacing MyTokenCrowdsale...
    ... 0x7f00b581721063eb670adcab0ecaedfdf259712730970a580732ff250713245d
    MyTokenCrowdsale: 0xae8228440e08a7ede5d414aa18dcf09540807981
  Saving artifacts...
  ```
  Note that your Token and Crowdsale address have been replaced at this point

## Interact with the Crowdsale contracts

* As usual, ensure that you are connected to Ropsten testnet and your personal & purchaser accounts are unlocked (in Ropsten testnet)

* Launch truffle console
  ```
  truffle console --network ropsten
  ```

* Define your purchaser. In my case I appointed accounts[3]
  ```
  purchaser = web3.eth.accounts[3]
  ```

* Purchase as usual
  ```
  MyTokenCrowdsale.deployed().then(inst => { crowdsale = inst })
  ```
  ```
  crowdsale.token().then(addr => { tokenAddress = addr } )
  ```
  ```
  myTokenInstance = MyToken.at(tokenAddress)
  ```
  ```
  myTokenInstance.transferOwnership(crowdsale.address)
  ```
  ```
  myTokenInstance.balanceOf(purchaser).then(balance => balance.toString(10))
  ```
  // verify balance (expect '0')
  ```
  MyTokenCrowdsale.deployed().then(inst => inst.sendTransaction({ from: purchaser, value: web3.toWei(0.05, "ether")}))
  ```
  // The sendTransaction will take some time
  ```
  myTokenInstance.balanceOf(purchaser).then(balance => purchaserMyTokenBalance = web3.fromWei(balance.toString(10), "ether"))
  ```
  // verify balance (expect '0.05')

* Here are a few functions to check various things:
  * How much the campaign raised:
  ```
  crowdsale.weiRaised()
  ```
  * Goal reached?
  ```
  crowdsale.goalReached()
  ```
  // true == reached, false == not yet
  * When campaign ends?
  ```
  crowdsale.closingTime()
  ```
  * What deposit was made by purchaser?
  ```
  crowdsale.vault()
  ```
  Expect to see something like this
  ```
  '0x9caffec87551076b996e384f3b36f564a7fd5149'
  ```
  ```
  var vault = RefundVault.at('0x9caffec87551076b996e384f3b36f564a7fd5149')
  ```
  ```
  vault.deposited('0x... address of the investor ...')
  ```
  * Has campaign ended?
  ```
  crowdsale.hasClosed()
  ```
  // true == ended, false == not yet

  * These functions can be seen when we run
  ```
  crowdsale
  ```

* Issue the refund
  Firstly check and ensure the crowdsale has ended and goal is not reached
  ```
  crowdsale.goalReached()
  ```
  expect `false`

  ```
  crowdsale.closingTime()
  ```
  expect `true`

  ```
  crowdsale.goalReached()
  ```
  expect `false`

  So we will finalize it
  ```
  crowdsale.finalize()
  ```

  And finally refund can be claimed, like this
  ```
  crowdsale.claimRefund({from:purchaser})
  ```

* Check the address of the `crowdsale.vault()` in https://ropsten.etherscan.io/ . There should be some transaction on the purchase & refunds.

* Check your purchaser record in https://ropsten.etherscan.io/ too. There should be a refund.

* What can we do next? There are a few experiments that we can do on this feature, eg:
  * Should deny refund before crowdsale ends
  * Should deny refunds after end if goal was reached
  * Should forward funds to wallet after end if goal was reached

  Do try these scenario as exercises.