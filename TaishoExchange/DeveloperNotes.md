# Overview

A set of instructions is provided below in order to test Taisho Swap in Mainnet but locally in Ganache CLI.  It was difficult to test any swapping.  

Use chainlink token smart contract address.  then in ethplorer.io, this contract has a list of holders(wallet address). 
Take a wallet address from the Holders tab and select an address that has some tokens enough to use as a testing "bridge".  The idea is to use Ganache CLI to test our smart contract that is in Mainnet.  This is done by using the wallet address
selected as the Holder of the Chainlink smart contract.  NOTE that the wallet address is above, 0xf584F8728B874a6a5c7A8d4d387C9aae9172D621. 



## Ganache start line to unlock address to use against Etherscan Mainnet

1. ganache-cli  -f https://mainnet.infura.io/v3/7eaff5f6184245569bd9e0a45548a219 -d -i 66 --unlock 0xf584F8728B874a6a5c7A8d4d387C9aae9172D621 -l 8000000

2. From console run 

```
node Swap.js
````

This will virtually transfer enough ETH from the unlock account to the locally selected account in Ganache CLI.
Make sure to replace the receiverAddress with the Ganache address and import this into Metamask connected to LocalHost:8545.

3. Now you are ready to run the 

```` 
node TaishoSupuritto.js 
````


### Truffle console commands

Get accounts: accounts

To get account balance:

web3.eth.getBalance(accounts[0])

To get Transaction Receipt

web3.eth.getTransaction(tx)

web3.eth.getBlock('latest')

Get balance of account from Wei to Ether
truffle(develop)> acc1 = accounts[1]
'0x28Da3F02B460F303FD161F6f3406cE9070aF8710'

truffle(develop)> balance1 = await web3.eth.getBalance(acc1)
undefined

truffle(develop)> web3.utils.fromWei(balance1, "ether")
'100'

### Web3 commands

1. web3.eth.accounts : list accounts
2. web3.personal.unlockAccount(address, pw) : unlock an account before any sendTransaction
3. web3.fromWei(web3.eth.getBalance(web3.eth.accounts[0]), 'ether') : check ether balance
4. web3.toWei(1.0, 'ether') : convert Ether to Wei Unit
5. web3.eth.getTransactionReceipt(tx) : retrieve transaction receipt from tx
6. web3.toAscii : convert bytes32 to String


  