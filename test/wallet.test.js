import Wallet from '~/src/wallet';
import bip39 from 'bip39';
import ethUtil from 'ethereumjs-util';
import {Buffer} from 'safe-buffer';

const MNEMONIC = 'exercise fantasy smooth enough arrive steak demise donkey true employ jealous decide blossom bind someone';
const PRIVATE_KEY = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';

// Create Wallet from mnemonic

test('wallet from mnemonic returns correct private key', () => {
    const privateKey = Wallet.fromMnemonic(MNEMONIC).getPrivateKeyString();
    expect(privateKey).toHaveLength(64);
    expect(privateKey).toEqual(PRIVATE_KEY);
});

test('wallet from mnemonic returns correct address', () => {
    const address = Wallet.fromMnemonic(MNEMONIC).getAddressString();
    expect(address.substr(0, 2)).toEqual('Mx');
    expect(address).toHaveLength(42);
    expect(address).toEqual('Mx7633980c000139dd3bd24a3f54e06474fa941e16');
});

test('wallet from mnemonic returns correct mnemonic', () => {
    const mnemonic = Wallet.fromMnemonic(MNEMONIC).getMnemonic();
    expect(mnemonic).toEqual(MNEMONIC);
});

// Create Wallet from private key

test('wallet from private key returns correct private key', () => {
    const privateKeyBytes = Buffer.from(PRIVATE_KEY, 'hex');
    const privateKey = Wallet.fromPrivateKey(privateKeyBytes).getPrivateKeyString();
    expect(privateKey).toHaveLength(64);
    expect(privateKey).toEqual(PRIVATE_KEY);
});

test('wallet from private key returns correct address', () => {
    const privateKeyBytes = Buffer.from(PRIVATE_KEY, 'hex');
    const address = Wallet.fromPrivateKey(privateKeyBytes).getAddressString();
    expect(address.substr(0, 2)).toEqual('Mx');
    expect(address).toHaveLength(42);
    expect(address).toEqual('Mx7633980c000139dd3bd24a3f54e06474fa941e16');
});

test('wallet from private key throws getting mnemonic', () => {
    const privateKeyBytes = Buffer.from(PRIVATE_KEY, 'hex');
    expect(() => {
        Wallet.fromPrivateKey(privateKeyBytes).getMnemonic();
    }).toThrow();
});

// Generate wallet

test('generated wallet have valid mnemonic and private key', function () {
    const wallet = Wallet.generate()
    expect(bip39.validateMnemonic(wallet.getMnemonic())).toBe(true);
    expect(ethUtil.isValidPrivate(wallet.getPrivateKey())).toBe(true);
})



