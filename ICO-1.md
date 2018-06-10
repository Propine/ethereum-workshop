## ICO

* Initial Coin Offerings - Create tokens and provide them with a certain value with promise of your business/ products offering

### How does Smart Contracts play a part in an ICO

* Smart Contracts = scripts that can handle money
* Smart Contracts are used to control the sale of tokens
* It directly controls the transfer of digital assets between parties under certain conditions

### Variants of ICO Smart Contracts

https://blockonomi.com/what-are-smart-contracts/#Potential_Use_Cases_of_Smart_Contracts

### Building your own ICO Smart Contracts

* We will use Open-Zeppelin to write crowdsale for our token

* Launch Powershell and navigate to your code root directory, then initialise a new contract
  ```
  truffle create contract MyTokenCrowdsale
  ```

* Open the MyTokenCrowdsale.sol file in your text editor
  then edit it such that the code looks like following:
  ```
  pragma solidity ^0.4.4;

  import './MyToken.sol';
  import 'zeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol';
  import 'zeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol';

  contract MyTokenCrowdsale is TimedCrowdsale, MintedCrowdsale {
    function MyTokenCrowdsale
    (
      uint256 _openingTime,
      uint256 _closingTime,
      uint256 _rate,
      address _wallet,
      MintableToken _token
    )
    public
    Crowdsale(_rate, _wallet, _token)
    TimedCrowdsale(_openingTime, _closingTime)
    {
      // constructor

    }
  }
  ```
  Note that:
  * We are importing our token and libraries from Open-Zeppelin
  * We are inheriting `TimedCrowdsale` and `MintedCrowdsale` from Open-Zeppelin in this exercise
  * We must give a few parameters to MyTokenCrowdsale constructor function as per the Crowdsale and TimeCrowdsale contracts, i.e. openingTime and closingTime timestamps, the rate of token per ether rate, the token address itself and the wallet address of the contract owner(s)

* We will connect to Ropsten testnet as in previous exercise.
  The steps are as follow:
  1. Launch PowerShell
  2. enter `geth attach http://13.229.195.247:8545`

* Once you are in the geth console, unlock your account
  ```
  personal.unlockAccount("0x...your account address ...", "AwesomePassphrase", 600)
  ```

  Note:
  * You may need to recreate your personal account (refer to `Development (Part 2)` in README)
  * If you do recreate, remember to update the truffle.js config
  * If need to, request funding using faucet.

* We will update the migrations file now.
  Run this in the code PowerShell
  ```
  truffle create migration MyTokenCrowdsale
  ```

* Open the resulting js file under `migrations` folder and replace the content with this:
  ```
  const MyTokenCrowdsale = artifacts.require('./MyTokenCrowdsale.sol');
  const MyToken = artifacts.require('./MyToken.sol');

  module.exports = function(deployer, network, accounts) {
    const openingTime = 1527469032 + 86400; // some time tomorrow (29 May 2018 as of this writing)
    const closingTime = openingTime + 86400 * 20; // 20 days
    const rate = new web3.BigNumber(1);
    const wallet = accounts[1];

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
              MyToken.address
          );
      });
  };
  ```
  Note that:
  * Do replace `MyToken` and `MyTokenCrowdsale` with your own token and crowdsale names
  * Remove the previous `MyToken` migration file. It will be migrated alongside with `MyTokenCrowdsale`
  * Notice that the deployer is a little different from how we usually do. This is promise where `MyToken` will be deployed first, then `MyTokenCrowdsale`. The latter needs the former address in the constructor

* Save the file, then run compile in code PowerShell.
  ```
  truffle compile
  ```
  You should see this:
  ```
  Compiling .\contracts\MyToken.sol...
  Compiling .\contracts\MyTokenCrowdsale.sol...
  Compiling zeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol...
  Compiling zeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol...
  Compiling zeppelin-solidity/contracts/token/ERC20/MintableToken.sol...
  Compiling zeppelin-solidity\contracts\crowdsale\Crowdsale.sol...
  Compiling zeppelin-solidity\contracts\math\SafeMath.sol...
  Compiling zeppelin-solidity\contracts\ownership\Ownable.sol...
  Compiling zeppelin-solidity\contracts\token\ERC20\BasicToken.sol...
  Compiling zeppelin-solidity\contracts\token\ERC20\ERC20.sol...
  Compiling zeppelin-solidity\contracts\token\ERC20\ERC20Basic.sol...
  Compiling zeppelin-solidity\contracts\token\ERC20\MintableToken.sol...
  Compiling zeppelin-solidity\contracts\token\ERC20\StandardToken.sol...

  Compilation warnings encountered:

  zeppelin-solidity/contracts/crowdsale/Crowdsale.sol:117:34: Warning: Unused function parameter. Remove or comment out the variable name to silence this warning.
    function _postValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
                                   ^------------------^
  ,zeppelin-solidity/contracts/crowdsale/Crowdsale.sol:117:56: Warning: Unused function parameter. Remove or comment out the variable name to silence this warning.
    function _postValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
                                                         ^----------------^
  ,zeppelin-solidity/contracts/crowdsale/Crowdsale.sol:144:35: Warning: Unused function parameter. Remove or comment out the variable name to silence this warning.
    function _updatePurchasingState(address _beneficiary, uint256 _weiAmount) internal {
                                    ^------------------^
  ,zeppelin-solidity/contracts/crowdsale/Crowdsale.sol:144:57: Warning: Unused function parameter. Remove or comment out the variable name to silence this warning.
    function _updatePurchasingState(address _beneficiary, uint256 _weiAmount) internal {
                                                          ^----------------^
  ,zeppelin-solidity/contracts/crowdsale/Crowdsale.sol:107:3: Warning: Function state mutability can be restricted to pure
    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
    ^ (Relevant source part starts here and spans across multiple lines).
  ,zeppelin-solidity/contracts/crowdsale/Crowdsale.sol:117:3: Warning: Function state mutability can be restricted to pure
    function _postValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
    ^ (Relevant source part starts here and spans across multiple lines).
  ,zeppelin-solidity/contracts/crowdsale/Crowdsale.sol:144:3: Warning: Function state mutability can be restricted to pure
    function _updatePurchasingState(address _beneficiary, uint256 _weiAmount) internal {
    ^ (Relevant source part starts here and spans across multiple lines).

  Writing artifacts to .\build\contracts
  ```

* Ensure that the geth console still connecting to testnet and that your account is unlocked.

  Then in code PowerShell, deploy the contract.
  ```
  truffle migrate --network ropsten --reset
  ```

  Note: you may need to increase `gas` config in `truffle.js`.

  This deployment will take some time. When it is done, you should see something like this:
  ```
  Using network 'ropsten'.

  Running migration: 1527439956_my_token_crowdsale.js
    Running step...
    Replacing MyToken...
    ... 0x5e9b358664408aa2ac523dfaf1d530501cac14804134b55d0bb00ba31f70bbe2
    MyToken: 0xceed1485123946b84b83bea2f2368e973b1084f9
    Replacing MyTokenCrowdsale...
    ... 0x61db32c79bea8a73ee0f93760e5900e17973094a032baa913d03b33a3c321dea
    MyTokenCrowdsale: 0xda3dd9e36c82404191f55eb75745aa99c987e0bb
  Saving artifacts...
  ```

* Check your account at https://ropsten.etherscan.io/
  You should see at least 2 transactions happening, one for `MyToken` and another one for `MyTokenCrowdsale`.

  To verify it, click the transaction hash and check the `To:`.
  It should list the hash of the contract being deployed.

  Example for MyTokenCrowdsale:
  ```
  To: [Contract 0xda3dd9e36c82404191f55eb75745aa99c987e0bb Created]
  ```
  This address should correspond to the address given in `MyTokenCrowdsale` migration.

Ref: https://blog.zeppelin.solutions/how-to-create-token-and-initial-coin-offering-contracts-using-truffle-openzeppelin-1b7a5dae99b6

### Interacting with ICO contracts

* Go back to the code PowerShell and run this.
  ```
  truffle console --network ropsten
  ```

* Firstly type and run
  ```
  purchaser = web3.eth.accounts[3]
  ```
  In here, I simply take an account that already exists in the test network. You could define a new account, get the position using `eth.accounts`, then fund it (it will act as purchaser)

* Then run
  ```
  MyTokenCrowdsale.deployed().then(inst => { crowdsale = inst })
  ```
  Expect to see
  ```
  undefined
  ```

* Run
  ```
  crowdsale.token().then(addr => { tokenAddress = addr } )
  ```
  Expect to see
  ```
  undefined
  ```

* Run
  ```
  tokenAddress
  ```
  Expect to see your Token address. In my example I see:
  ```
  '0xceed1485123946b84b83bea2f2368e973b1084f9'
  ```

* Run
  ```
  myTokenInstance = MyToken.at(tokenAddress)
  ```
  Expect to see Truffle Contract object