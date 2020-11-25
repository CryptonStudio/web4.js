const HDWalletProvider = require('@truffle/hdwallet-provider');
let contract = require("@truffle/contract");

function Web4(
  mnemonic,
  provider,
  address_index = 0,
  num_addresses = 1,
  shareNonce = true,
  wallet_hdpath = "m/44'/60'/0'/0/",
  pollingInterval = 600000
) {

  provider = new HDWalletProvider(
    mnemonic,
    provider,
    address_index,
    num_addresses,
    shareNonce,
    wallet_hdpath,
    pollingInterval
  );

  // stop polling for blocks
  provider.engine.stop();

  // create smart contract abstraction object by ABI
  this.getContractAbstraction = function (abi) {
    // create abstraction
    let abstraction = contract({ abi });
    // set HDWallet provider
    abstraction.setProvider(provider);    

    // set default account
    abstraction.defaults({ from: abstraction.currentProvider.addresses[0] });

    // use this function instead of this.at(...) to get instance
    abstraction.getInstance = async function (address) {
      let instance = await this.at(address);

      instance.encodeABI = function (method, ...theArgs) {       
        return this.contract.methods[method].apply(this, theArgs).encodeABI();
      }

      instance.sendTransactionWithETH = function (method, value, ...theArgs) {
        let data = this.encodeABI.apply(this, theArgs.unshift(method));
        return this.sendTransaction({ value, data });
      }
      
      return instance;
    };

    return abstraction;
  }

};

module.exports = Web4;

