const dotenv = require('dotenv');
const getBnc = require('./getRequest')
const postBnc = require('./postRequest')
const postgres = require('postgres');
const fs = require('fs')
dotenv.config();

// const apiKey = process.env.bncKey;
// const secretKey = process.env.bncSecret
// const endpoint = 'https://api3.binance.com'
// const path = '/sapi/v1/margin/isolated/account'
// const parameters = ''

const apiKey = process.env.APIKEY;
const secretKey = process.env.SECRET
const endpoint = 'https://api3.binance.com'
const path = '/api/v3/order/test'
const parameters = 'symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1'

balance = async (apiKey, secretKey, endpoint, path, parameters) => {
    try {
        const bncSnap = await getBnc(apiKey, secretKey, endpoint, path, parameters)
        // console.log(bncSnap.balances[0]);
        fs.writeFileSync("bncSnap.json", JSON.stringify(bncSnap))
        return bncSnap
    } catch (error) {
        console.log(error);
    }
}

getAssets = async () => {
    const getBalance = await balance(apiKey, secretKey, endpoint, path, parameters)
    const element = {}
    for (let index = 0; index < getBalance.userAssets.length; index++) {
        let line = getBalance.userAssets[index]
        if (line.free>0 || line.locked>0 ) {
            let assetName = line.asset
            element[assetName] = parseFloat(line.free)+parseFloat(line.locked);
            console.log(line);
        }
    }
    console.log(element);
    console.log(getBalance.assets[0]);
}

order = async (apiKey, secretKey, endpoint, path, parameters) => {
    try {
        const bncOrder = await postBnc(apiKey, secretKey, endpoint, path, parameters)
        fs.writeFileSync("bncOrder.json", JSON.stringify(bncOrder))
        return bncOrder
    } catch (error) {
        console.log(error);
    }
}

postOrder = async () => {
    const postOrderRequest = await order(apiKey, secretKey, endpoint, path, parameters)
    console.log(postOrderRequest);
}

postOrder()