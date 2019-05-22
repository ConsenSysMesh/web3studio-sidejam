const TruffleHDWalletProvider = require('truffle-hdwallet-provider');
const privateKey =
  '0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63';

module.exports = {
  networks: {
    pantheon: {
      provider: () =>
        new TruffleHDWalletProvider(privateKey, 'http://localhost:8545'),
      network_id: '*',
      gasPrice: 0,
      gas: '0x1ffffffffffffe'
    }
  }
};
