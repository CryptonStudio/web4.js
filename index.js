const HDWalletProvider = require('@truffle/hdwallet-provider');
let contract = require("@truffle/contract");

function Web4(
  mnemonic,
  provider,
  address_index = 0,
  num_addresses = 1,
  shareNonce = true,
  wallet_hdpath = "m/44'/60'/0'/0/"
) {

  provider = new HDWalletProvider(
    mnemonic,
    provider,
    address_index,
    num_addresses,
    shareNonce,
    wallet_hdpath
  );

  this.getContractInstance = function(abi) {
    let instance = contract({ abi });
    instance.setProvider(provider);
    
    instance.defaults({from: instance.currentProvider.addresses[0]});

    instance.encodeABI = (method, ...theArgs) => {
      return this.contract.methods[method](theArgs).encodeABI();
    }

    instance.sendTransactionWithETH = (method, value, ...theArgs) => {
      let data = this.encodeABI(method, theArgs);      
      return this.sendTransaction({ value, data });
    }
    return instance;
  }

};

module.exports = Web4;

