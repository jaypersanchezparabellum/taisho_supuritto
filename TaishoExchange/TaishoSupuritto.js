var Web3 = require('web3');
var fs = require('fs')
const BigNumber = require('bignumber.js');
//const oneSplitABI = require('./OneSplit.json');
//const erc20ABI = require('./ERC20.json');

const erc20contractJSON = fs.readFileSync('./ERC20.json')
const onesplitcontractJSON = fs.readFileSync('./OneSplit.json')
const erc20ABI = JSON.parse(erc20contractJSON);
const oneSplitABI = JSON.parse(onesplitcontractJSON)

const onesplitAddress = "0xC586BeF4a0992C495Cf22e1aeEE4E446CECDee0E"; // 1plit contract address on Main net
const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f"; // DAI ERC20 contract address on Main net
const fromAddress = "0x4d10ae710Bd8D1C31bd7465c8CBC3add6F279E81";
const fromToken = daiAddress;
const fromTokenDecimals = 18;
const toToken = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'; // ETH
const toTokenDecimals = 18;
const amountToExchange = new BigNumber(1000);
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
const onesplitContract = new web3.eth.Contract(oneSplitABI, onesplitAddress);
const daiToken = new web3.eth.Contract(erc20ABI, fromToken);

oneSplitDexes = [
    "Uniswap",
    "Kyber",
    "Bancor",
    "Oasis",
    "CurveCompound",
    "CurveUsdt",
    "CurveY",
    "Binance",
    "Synthetix",
    "UniswapCompound",
    "UniswapChai",
    "UniswapAave"
];

const myBTCtokenAddress = '32MPs4xM93EsYteW8taYDBZPrtdfFiXPkP';
const myETHtokenAddress = '0xa0eCE7ba3e5d1B0fa31cA5011dCd8982C91dab01';
const myDAItokenAddress = '0x82E77A063BA904092CD4aD6aA8ff33eF1d1b3150';

const tokenAddress0 = '0xEe2b685C332c455b6238394f679B94Ae72c3f084';
const tokenAddress1 = '0xB81E2CCCB216A582C6EE9aE34c90D8d1702d29e3';


/*
* This function makes a call to the 1inchProtocal getExpectedReturn function to get the best price based
* on paramaters passed
*
*   @fromToken: is the address of the token you currently own.
*   @toToken: is the address of the token you want to swap your tokens for.
*   @amount: the number of tokens you’d like to swap
*   @parts: is used to describe along which platforms the place is distributed. Check the distribution return value for more details but we’ll use by default 100.
*   @disableFlags: enables you to pass option to the function, for example, disabling a specific DEX
*/
async function getQuote(fromToken, toToken, amount) {
    let quote = null;
    try {
        quote = await onesplitContract.methods.getExpectedReturn(fromToken, toToken, amount, 100, 0).call();
    } catch (error) {
        console.log('Impossible to get the quote', error)
    }
    console.log("Trade From: " + fromToken)
    console.log("Trade To: " + toToken);
    console.log("Trade Amount: " + amountToExchange);
    //console.log(new BigNumber(quote.returnAmount).shiftedBy(-fromTokenDecimals).toString());
    let bestPrice = new BigNumber(quote.returnAmount).shiftedBy(-fromTokenDecimals).toString();
    console.log(`Best Price :: ${bestPrice}`)
    console.log(`Exh - ${quote.distribution.length} :: ${oneSplitDexes.length}`)
    console.log("Using Dexes:");
    for (let index = 0; index < quote.distribution.length; index++) {
        let onesplitindex = oneSplitDexes[index];
        let distributionindex = quote.distribution[index];
        //console.log(oneSplitDexes[index] + ": " + quote.distribution[index] + "%");
        if(onesplitindex !== undefined) {
            console.log(`${onesplitindex} :: ${distributionindex}`);
        }
        
    }
}

/*function approveToken(tokenInstance, receiver, amount) {
    tokenInstance.methods.approve(receiver, amount).send({ from: fromAddress }, async function(error, txHash) {
        if (error) {
            console.log("ERC20 could not be approved", error);
            return;
        }
        console.log("ERC20 token approved to " + receiver);
        const status = await waitTransaction(txHash);
        if (!status) {
            console.log("Approval transaction failed.");
            return;
        }
    })
}*/

async function waitTransaction(txHash) {
    let tx = null;
    while (tx == null) {
        tx = await web3.eth.getTransactionReceipt(txHash);
        await sleep(2000);
    }
    console.log("Transaction " + txHash + " was mined.");
    return (tx.status);
}


/*
*   The function below is the full flow.  
*   1. Call getQuote to get the best price
*   2. Get approval from 1inch dex aggregator to spend our token
*   3. Perform actual Swap
*/
let _amountToExchange = '1000000000000000000'
let amountWithDecimals = new BigNumber(_amountToExchange).shiftedBy(fromTokenDecimals).toFixed()
getQuote(fromToken, toToken, amountWithDecimals, function(quote) {
    approveToken(daiToken, onesplitAddress, amountWithDecimals, async function() {
        // We get the balance before the swap just for logging purpose
        console.log(`Getting Approval`)
        let ethBalanceBefore = await web3.eth.getBalance(fromAddress);
        let daiBalanceBefore = await daiToken.methods.balanceOf(fromAddress).call();
        onesplitContract.methods.swap(fromToken, toToken, amountWithDecimals, quote.returnAmount, quote.distribution, 0).send({ from: fromAddress, gas: 8000000 }, async function(error, txHash) {
            if (error) {
                console.log("Could not complete the swap", error);
                return;
            }
            const status = await waitTransaction(txHash);
            // We check the final balances after the swap for logging purpose
            let ethBalanceAfter = await web3.eth.getBalance(fromAddress);
            let daiBalanceAfter = await daiToken.methods.balanceOf(fromAddress).call();
            console.log("Final balances:")
            console.log("Change in ETH balance", new BigNumber(ethBalanceAfter).minus(ethBalanceBefore).shiftedBy(-fromTokenDecimals).toFixed(2));
            console.log("Change in DAI balance", new BigNumber(daiBalanceAfter).minus(daiBalanceBefore).shiftedBy(-fromTokenDecimals).toFixed(2));
        });
    });
});
