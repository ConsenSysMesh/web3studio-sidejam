/**
 * Code originally from [Truffle](https://github.com/trufflesuite/truffle/blob/fa21648cc76c4be9f4d667b9467d13ea7a5b4975/packages/truffle-hdwallet-provider/src/index.js)
 *
 * Issue to track changes and hopefully remove this code
 * https://github.com/trufflesuite/truffle/issues/2040
 */
/* eslint-disable require-jsdoc */
const bip39 = require('bip39');
const ethJSWallet = require('ethereumjs-wallet');
const hdkey = require('ethereumjs-wallet/hdkey');
const ProviderEngine = require('web3-provider-engine');
const FiltersProvider = require('web3-provider-engine/subproviders/filters.js');
const WebsocketProvider = require('web3-provider-engine/subproviders/websocket.js');
const NonceProvider = require('web3-provider-engine/subproviders/nonce-tracker');
const HookedProvider = require('web3-provider-engine/subproviders/hooked-wallet.js');
const Transaction = require('ethereumjs-tx');
const ethUtil = require('ethereumjs-util');

export default (mnemonic, address_index = 0, num_addresses = 10) => {
  let hdwallet;
  const wallet_hdpath = "m/44'/60'/0'/0/";
  const wallets = {};
  const addresses = [];
  const engine = new ProviderEngine();

  // private helper to normalize given mnemonic
  const normalizePrivateKeys = mnemonic => {
    if (Array.isArray(mnemonic)) return mnemonic;
    else if (mnemonic && !mnemonic.includes(' ')) return [mnemonic];
    // if truthy, but no spaces in mnemonic
    else return false; // neither an array nor valid value passed;
  };

  // private helper to check if given mnemonic uses BIP39 passphrase protection
  const checkBIP39Mnemonic = mnemonic => {
    hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error('Mnemonic invalid or undefined');
    }

    // crank the addresses out
    for (let i = address_index; i < address_index + num_addresses; i++) {
      const wallet = hdwallet.derivePath(wallet_hdpath + i).getWallet();
      const addr = `0x${wallet.getAddress().toString('hex')}`;
      addresses.push(addr);
      wallets[addr] = wallet;
    }
  };

  // private helper leveraging ethUtils to populate wallets/addresses
  const ethUtilValidation = privateKeys => {
    // crank the addresses out
    for (let i = address_index; i < address_index + num_addresses; i++) {
      const privateKey = Buffer.from(privateKeys[i].replace('0x', ''), 'hex');
      if (ethUtil.isValidPrivate(privateKey)) {
        const wallet = ethJSWallet.fromPrivateKey(privateKey);
        const address = wallet.getAddressString();
        addresses.push(address);
        wallets[address] = wallet;
      }
    }
  };

  const privateKeys = normalizePrivateKeys(mnemonic);

  if (!privateKeys) checkBIP39Mnemonic(mnemonic);
  else ethUtilValidation(privateKeys);

  const tmp_accounts = addresses;
  const tmp_wallets = wallets;

  engine.addProvider(
    new HookedProvider({
      getAccounts(cb) {
        cb(null, tmp_accounts);
      },
      getPrivateKey(address, cb) {
        if (!tmp_wallets[address]) {
          return cb('Account not found');
        } else {
          cb(null, tmp_wallets[address].getPrivateKey().toString('hex'));
        }
      },
      signTransaction(txParams, cb) {
        let pkey;
        const from = txParams.from.toLowerCase();
        if (tmp_wallets[from]) {
          pkey = tmp_wallets[from].getPrivateKey();
        } else {
          cb('Account not found');
        }
        const tx = new Transaction(txParams);
        tx.sign(pkey);
        const rawTx = `0x${tx.serialize().toString('hex')}`;
        cb(null, rawTx);
      },
      signMessage({ data, from }, cb) {
        const dataIfExists = data;
        if (!dataIfExists) {
          cb('No data to sign');
        }
        if (!tmp_wallets[from]) {
          cb('Account not found');
        }
        const pkey = tmp_wallets[from].getPrivateKey();
        const dataBuff = ethUtil.toBuffer(dataIfExists);
        const msgHashBuff = ethUtil.hashPersonalMessage(dataBuff);
        const sig = ethUtil.ecsign(msgHashBuff, pkey);
        const rpcSig = ethUtil.toRpcSig(sig.v, sig.r, sig.s);
        cb(null, rpcSig);
      },
      signPersonalMessage(...args) {
        this.signMessage(...args);
      }
    })
  );

  engine.addProvider(new NonceProvider());
  engine.addProvider(new FiltersProvider());
  engine.addProvider(new WebsocketProvider({ rpcUrl: 'ws://127.0.0.1:8546' }));
  engine.start(); // Required by the provider engine.

  return engine;
};
