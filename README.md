# Workshop

## Installations
### Install Ethereum
https://www.ethereum.org/cli
* Download latest stable binary (.exe) 32/ 64 bit (depending on platform)
* double click to install it

### Chocolatey
https://davidburela.wordpress.com/2016/11/18/how-to-install-truffle-testrpc-on-windows-for-blockchain-development/
* This is for installing chocolatey (alternatively install Ubuntu subsystem for Windows 10 from Microsoft store)
* Go to https://chocolatey.org/ and follow installation instruction.
In my case:
  * Right click windows icon, click "Windows PowerShell (Admin)"
  * Go to https://chocolatey.org/install
  * Get the installation command for your specific shell. In my case my command is:
    ```bash
    Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
    ```

### Windows Tools with Chocolatey
* This is for installing windows tools with chocolatey
* Restart PowerShell (run as administrator) (As advised during chocolatey install)
* Type and run
  ```bash
  choco install nodejs.install -y
  ```
* Type and run
  ```bash
  choco install git -y
  ```

### Install Tools via npm
* Restart PowerShell (run as administrator) (to ensure that it reloads the path)
* Type and run
  ```bash
  npm install -g npm
  ```
* Type and run
  ```bash
  npm install -g --production windows-build-tools
  ```
  (This will take a while)
* Type and run
  ```bash
  npm install -g truffle ganache-cli
  ```
* Close the admin PowerShell (type and run `exit`)

### Metamask
* Install metamask addon in your favourite browser
  https://metamask.io/

### Text editor
* Sublime/ Visual Studio/ jet brains IDE with plugin, intellij IDEA, sublime text - solidity syntax and linter plugins, atom

## Development (Part 1)
* Create empty folder in your work directory
* Open PowerShell for regular user (non Admin)
* Go to the newly created folder by using `cd`, example
  ```bash
  cd C:\workshop
  ```
* Type and run
  ```bash
  truffle init
  ```

* We will use the Migrations.sol file (under `contracts` folder) to migrate the contract we make today to Ganache and Rinkeby testnet
  (Use the file as is from `truffle init`, no edit was done)
* Migrations folder = migrations file - specific migration of the file we discussed above
* You will see later when we compile that a build folder comes up here and that will contain a sol file that will be built from the migrations contract here and will use the js file in migrations folder

* truffle.js = configuration file. Enter this in `module.exports` enclosure:
  ```
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }
  ```
  We will also use this file to update the rinkeby test config later on

* Create hello world contract:
  ```bash
  truffle create contract HelloWorld
  ```

* Open HelloWorld.sol (under `contracts` folder)

* HelloWorld - class name - use capital letter for first letter and use camel casing
* Constructor function - gets called once only when contract gets deployed to a network

* Add following after constructor function:
  ```
    string private message;

    function getMessage() constant returns (string) {
        return message;
    }
    function setMessage(string newMessage) {
        message = newMessage;
    }
  ```

* To be able to deploy this contract, we need a migration - specific to this contract

* Type and run
  ```bash
  truffle create migration HelloWorld
  ```

* There will be a js file created under `migrations` folder. Open it.

* Add artifact and deploy it (Add in the hello_world migration file):
  ```
    const HelloWorld = artifacts.require('HelloWorld');
    deployer.deploy(HelloWorld);
  ```

* Launch another PowerShell (regular user)
* Type and run
  ```bash
  ganache-cli
  ```

* This will create a bunch of addresses and private keys for you. Its all locally run on the computer.
  Whats great about Ganache is that it mines everything instantly. You don't have to wait for any period of time to interact with your contract or to have your transactions mined.
  For this steps, you might need to unblock firewall

* Go back to the first PowerShell
* Type and run
  ```bash
  truffle compile
  ```
* Then
  ```bash
  truffle migrate --reset
  ```
* And finally
  ```bash
  truffle console
  ```

* web3.js - Ethereum JavaScript API. web3.js is a collection of libraries which allow you to interact with a local or remote ethereum node, using a HTTP or IPC connection
* In the truffle console, type and run
  ```bash
  web3.eth.accounts
  ```
* Then
  ```bash
  web3.eth.accounts[0]
  ```
  this account is always the creator of the migrations contract and the hello world contract

* Type and run
  ```bash
  HelloWorld.deployed()
  ```
* Type and run
  ```bash
  HelloWorld.deployed().then(function(instance){contract = instance})
  ```
  Expect to see `undefined`

* Type and run
  ```bash
  contract.getMessage.call()
  ```
  Expect to see ''

* Explain constant in getMessage = no use of gas - get value from local blockchain copy. No change in state.
* Type and run
  ```bash
  contract.setMessage("New Test Message")
  ```
  - will cost gas - transaction is instantly mined.

* Type and run
  ```bash
  contract.getMessage.call()
  ```
  Expect to see `'New Test Message'`

* Exit ganache-cli
  Go to ganache-cli PowerShell & press ctrl+c

* Now we will deploy this contract on Rinkeby testnet
* Run Rinkeby on the computer:
  ```bash
  geth --rinkeby --rpc --rpcapi web3,db,personal,eth,net
  ```
  (must use small r in `Rinkeby`)
* IPC endpoint opened: we need this IPC end point to be able to run geth javascript console to interact with contracts deployed on Rinkeby testnet
  example:
  ```bash
  INFO [04-16|00:08:34] IPC endpoint opened                      url=\\\\.\\pipe\\geth.ipc
  ```

* Launch another PowerShell
* Type and run
  ```bash
  geth attach ipc:\\.\pipe\geth.ipc
  ```
  **Note** that the backslash \ got escaped. so we have to remove 1 backslash for each backslash (eg \\ becomes \)

* In the geth console:
  ```bash
  eth.accounts
  ```
  (case sensitive)
* If it returns nothing, then maybe you need to create personal account (being the first time using the testnet)
  ```bash
  personal.newAccount("SomePassphrase")
  ```
  (Substitute SomePassphrase with your own passphrase)

* Type and run
  ```bash
  eth.getBalance(eth.accounts[0])
  ```
  result value is denominated in Wei - smallest denomination in ether - 10 to power 18
* If you are doing this for the first time, you need to wait until about 30 mins to download entire chain which can take unto 30 mins or so

* We need to change config file (truffle.js) so we can deploy contract over Rinkeby. config file change.
  ```bash
    rinkeby: {
      host: "localhost",
      port: 8545,
      network_id: "4", //main net id is 1,
      from: "0xb3881106cff32580c0a5321fdc907ab9f7a7dfc6”,
      gas: 200000
    }
  ```

* In javascript console (the one started with `geth attach`): Unlock account over Rinkeby:
  ```bash
    personal.unlockAccount("0x...your account number ...")
  ```
  —> enter passphrase when prompted

* How to copy and paste in PowerShell?
  Copy -> highlight the word then press `Enter`
  Paste -> right click mouse

* We need to fund this account and also ensure its imported into metamask
* Import into metamask = import via json file found in (example path)
  ```C:\Users\(username)\AppData\Roaming\Ethereum\rinkeby\keystore```
  If not able to see `AppData` folder, click the View menu (at top of windows explorer) and ensure "Hidden items" is ticked

* Fund this account using faucet through social media.
  For example, post this:
  ```
    Requesting faucet funds into 0x...your account number... on the #Rinkeby #Ethereum test network.
  ```
  in your Twitter or Facebook or Google plus public post, then get the link to it and paste in
  https://www.rinkeby.io/#faucet

* Go back to the PowerShell for truffle console

* Exit previous console (if haven't) by pressing ctrl+c
* Then type and run
  ```
  truffle migrate --network Rinkeby
  ```
  will see
    "Using network 'rinkeby'
    Network up to date"

* Check the transaction on Rinkeby.etherscan.io

* Go to remix.ethereum.org which is remix solidity ide to get ABI for the contract
* Copy code (HelloWorld.sol) to a new file in remix
* Click `compile`
* Click on `details` and copy ABI
* Go to the geth PowerShell and paste this
  ```
  abi = [ _what was copied from remix_ ]
  ```
  **Note** that need to remove the newline and make the ABI stuffs flat (all code in 1 line)
* Just like we made contract object in truffle console, we will make one in JS console like this:
  ```bash
  contract = eth.contract(abi)
  ```
* Then
  ```bash
  instance = contract.at("hello world contract address from truffle console")
  ```
* Now can interact with the contract using:
  ```bash
  instance.getMessage.call()
  ```
  ```bash
  instance.setMessage("new message", {from: eth.accounts[0]})
  ```
* Check for transaction on Rinkeby.etherscan.io

## Development (Part 2)

### Deploying to testnet

In this part we will deploy truffle contract to Ropsten test server and attempt to exchange ether

* Instead of running the Ropsten testnet locally, we will use a remote testnet.

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
  This is your account address. Copy from the console and note it down as we will be using this later on.

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
