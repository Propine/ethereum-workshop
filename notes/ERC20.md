## ERC20 Token

### What is ERC20

* ERC = "Ethereum Request for Comments"
* It is a guideline/ standard used in smart contracts when creating and implementing new token in Ethereum ecosystem
* smart contracts = scripts that can handle money
* Ethereum = cryptocurrency and blockchain system based on tokens which can be bought, sold or traded

More references:
  https://theethereum.wiki/w/index.php/ERC20_Token_Standard

  https://en.wikipedia.org/wiki/ERC20
  https://www.investopedia.com/news/what-erc20-and-what-does-it-mean-ethereum/

  https://www.youtube.com/watch?v=cqZhNzZoMh8


### Creating your own ERC20 token

* We will use Open-Zeppelin contracts

* Launch Powershell and navigate to your code root directory, then run following commands one by one
  ```
  npm init -y
  npm install -E zeppelin-solidity
  ```

  You should see something like this:
  ```
  npm WARN deprecated zeppelin-solidity@1.9.0: This package has been renamed to openzeppelin-solidity.
  npm notice created a lockfile as package-lock.json. You should commit this file.
  + zeppelin-solidity@1.9.0
  added 1 package from 1 contributor in 1.849s
  ```

* In the same code directory, initialise a new contract
  ```
  truffle create contract MyToken
  ```

* Open the MyToken.sol file in your text editor
  then edit it such that the code looks like following:
  ```
  pragma solidity ^0.4.4;

  import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

  contract MyToken is MintableToken {

    string public constant name = "My Own Token";
    string public constant symbol = "MOT";
    uint8 public constant decimals = 18;

  }
  ```
  Note that:
  * We are importing library from Open-Zeppelin
  * We can define our own token name and symbol. You don't have to follow the name and symbol above
  * `Mintable` lets us create as many tokens as we want so we do not need to define initial supply yet
  * For decimals, 18 is pretty standard in community.

* We will connect to Ropsten testnet as in previous exercise.
  The steps are as follow:
  1. Launch PowerShell
  2. enter `geth attach http://13.229.195.247:8545`

* Once you are in the geth console, unlock your account
  ```
  personal.unlockAccount("0x...your account address ...", "AwesomePassphrase", 600)
  ```

  If need to, request funding using faucet.

* We will update the migrations file now.
  Run this in the first code PowerShell
  ```
  truffle create migration MyToken
  ```

* Open the resulting js file under `migrations` folder and replace the content with this:
  ```
  module.exports = function(deployer) {
    const MyToken = artifacts.require('MyToken.sol');
    deployer.deploy(MyToken);
  };
  ```

* Compile this in code PowerShell too.
  ```
  truffle compile
  ```
  You should see this:
  ```
  Compiling .\contracts\MyToken.sol...
  Compiling zeppelin-solidity/contracts/token/ERC20/MintableToken.sol...
  Compiling zeppelin-solidity\contracts\math\SafeMath.sol...
  Compiling zeppelin-solidity\contracts\ownership\Ownable.sol...
  Compiling zeppelin-solidity\contracts\token\ERC20\BasicToken.sol...
  Compiling zeppelin-solidity\contracts\token\ERC20\ERC20.sol...
  Compiling zeppelin-solidity\contracts\token\ERC20\ERC20Basic.sol...
  Compiling zeppelin-solidity\contracts\token\ERC20\StandardToken.sol...
  Writing artifacts to .\build\contracts
  ```

* Ensure that the geth console still connecting to testnet and that your account is unlocked.

  Then deploy the contract.
  ```
  truffle migrate --network ropsten --reset
  ```

  Note: you may need to increase `gas` config in `truffle.js`.

  This deployment will take some time. When it is done, you should see something like this:
  ```
  Using network 'ropsten'.

  Running migration: 1524420214_simple_transfer.js
    Replacing SimpleTransfer...
    ... 0xa56f9f6f6143bcce761b2f0cdc21ad9adaea804a459f399d847118b6e49a0a26
    SimpleTransfer: 0x3f8add2768d253d4b774227c938f45effc90c93d
  Saving artifacts...
  Running migration: 1526226388_my_token.js
    Deploying MyToken...
    ... 0xd3d7575a8f0da32b7980ac98cb5b1351318a5c286459a23169a2885c879d8c10
    MyToken: 0x4807115ab6ac641aaace377b8c109c95d7163248
  Saving artifacts...
  ```

* Check your account at https://ropsten.etherscan.io/
  You should see some transactions happening.

  To verify it, click the transaction hash and check the `To:`.
  It should list the hash of the contract being deployed.

  Example for MyToken:
  ```
  To: [Contract 0x4807115ab6ac641aaace377b8c109c95d7163248 Created]
  ```

Ref: https://medium.freecodecamp.org/create-an-ethereum-token-using-open-source-contracts-open-zeppelin-1e132e6233ed

### Interacting with ERC20 tokens
We will attempt to interact with our new tokens

* Go back to the code PowerShell and run this.
  ```
  truffle console --network ropsten
  ```

* Firstly type and run
  ```
  MyToken.deployed().then(inst => { mytoken = inst })
  ```
  Expect to see
  ```
  Undefined
  ```

* Check balance
  ```
  mytoken.balanceOf('0xc... your account address...')
  ```
  If you have not interacted with the token, the balance should look like this.
  ```
  BigNumber { s: 1, e: 0, c: [ 0 ] }
  ```

* We will mint new token to ourselves
  For eg, if we want to mint 100, then
  ```
  mytoken.mint('0xc... your account address...', 100)
  ```
  Check the balance again. You should see something like this.
  ```
  BigNumber { s: 1, e: 2, c: [ 100 ] }
  ```

* Transfer balance
  Get the ethereum address you want to transfer to and the amount to transfer, then run this
  ```
  mytoken.transfer('0xc... the recipient account address...', [amount to transfer])
  ```
  Verify whether the transfer is succesful using `balanceOf` or by checking the account at https://ropsten.etherscan.io/ (Under `Token Transfers` tab)