var Web3 = require('web3');
var fs = require('fs')
const BigNumber = require('bignumber.js');
const ERC20TransferABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
]

const ADDRESS = "0x514910771AF9Ca656af840dff83E8264EcF986CA" //usdc

const web3 = new Web3('http://localhost:8545'); 

const Token = new web3.eth.Contract(ERC20TransferABI, ADDRESS);

const senderAddress = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621"
//replace this address from an address in Ganache CLI
const receiverAddress = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1"

Token.methods.balanceOf(senderAddress).call(function(err, res) {
    if (err) {
        console.log("An error occured", err);
        return
    }
    console.log("The balance is: ",res)
})

Token.methods.transfer(receiverAddress, "100000000000000000000").send({from: senderAddress}, function(err, res) {
    if (err) {
        console.log("An error occured", err);
        return
    }
    console.log("Hash of the transaction: " + res)
})