import pantheonProvider from './pantheonProvider';
const mnemonic =
  'slim diet quick reveal sunset young panic mask manual pulp fun hybrid industry cream never'; // 12 word mnemonic

export default {
  contracts: [require('../build/contracts/Stratego4')],
  events: ['PieceMoved'],
  web3: {
    web3: {
      customProvider: pantheonProvider(mnemonic)
    }
  }
};
