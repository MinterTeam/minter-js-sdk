import axios from 'axios';
import {Buffer} from 'safe-buffer';
import ethUtil from 'ethereumjs-util';
import MinterTx from 'minterjs-tx';
import MinterSendTxData from 'minterjs-tx/src/tx-data/send';
import MinterCreateCoinTxData from 'minterjs-tx/src/tx-data/create-coin';
import {TX_TYPE_SEND, TX_TYPE_CREATE_COIN} from 'minterjs-tx/src/tx-types';
import converter from 'minterjs-tx/src/converter';
import {formatCoin, mToBuffer} from 'minterjs-tx/src/helpers';
import {getNonce} from "./utils";

export function sendCoins({nodeUrl, privateKey, address, amount = 0, coinSymbol, message}) {
    //@TODO asserts
    return new Promise((resolve, reject) => {
        getNonce(nodeUrl, ethUtil.privateToAddress(Buffer.from(privateKey, 'hex')).toString('hex'))
            .then((nonce) => {
                if (typeof privateKey === 'string') {
                    privateKey = Buffer.from(privateKey, 'hex');
                }
                const txData = new MinterSendTxData({
                    to: mToBuffer(address),
                    coin: formatCoin(coinSymbol),
                    value: `0x${converter.convert(amount, 'pip').toString(16)}`,
                });
                const txParams = {
                    nonce: `0x${nonce.toString(16)}`,
                    gasPrice: '0x01',
                    type: TX_TYPE_SEND,
                    data: txData.serialize(),
                };
                if (message) {
                    txParams.payload = `0x${Buffer.from(message, 'utf-8').toString('hex')}`;
                }

                const tx = new MinterTx(txParams);
                tx.sign(privateKey);

                axios.post(`${nodeUrl}/api/sendTransaction`, {
                    transaction: tx.serialize().toString('hex'),
                })
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject)
    })
}

export function createCoin({nodeUrl, privateKey, coinName, coinSymbol, initialAmount, crr, initialReserve}) {
    return new Promise((resolve, reject) => {
        getNonce(nodeUrl, ethUtil.privateToAddress(Buffer.from(privateKey, 'hex')).toString('hex'))
            .then((nonce) => {
                if (typeof privateKey === 'string') {
                    privateKey = Buffer.from(privateKey, 'hex');
                }
                const txData = new MinterCreateCoinTxData({
                    name: coinName,
                    symbol: formatCoin(coinSymbol),
                    initialAmount: `0x${ethUtil.padToEven(converter.convert(initialAmount, 'pip').toString(16))}`,
                    crr: `0x${ethUtil.padToEven(Number(crr).toString(16))}`,
                    initialReserve: `0x${ethUtil.padToEven(converter.convert(initialReserve, 'pip').toString(16))}`
                });
                const txParams = {
                    nonce: `0x${nonce.toString(16)}`,
                    gasPrice: '0x01',
                    type: TX_TYPE_CREATE_COIN,
                    data: txData.serialize(),
                };

                const tx = new MinterTx(txParams);
                tx.sign(privateKey);

                axios.post(`${nodeUrl}/api/sendTransaction`, {
                    transaction: tx.serialize().toString('hex'),
                })
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject)
    })
}
