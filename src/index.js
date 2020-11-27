const HDWalletProvider = require('@truffle/hdwallet-provider');
let contract = require("@truffle/contract");

function Web4() {
  let provider;
  let defaultAddress;

  this.setProvider = function (_provider, _address = "") {
    provider = _provider;
    defaultAddress = _address;
  }

  this.setHDWalletProvider = function (
    mnemonic,
    providerOrUrl,
    addressIndex = 0,
    numberOfAddresses = 1,
    shareNonce = true,
    derivationPath = "m/44'/60'/0'/0/",
    pollingInterval = 600000
  ) {
    provider = new HDWalletProvider({      
      providerOrUrl,
      addressIndex,
      numberOfAddresses,
      shareNonce,
      derivationPath,
      pollingInterval,
      mnemonic,
    });   

    defaultAddress = provider.addresses[0];

    // stop polling for blocks
    provider.engine.stop();
  }

  // create smart contract abstraction object by ABI
  this.getContractAbstraction = function (abi) {
    // create abstraction
    let abstraction = contract({ abi });

    // set current provider
    abstraction.setProvider(provider);

    // set default account if defined
    if (defaultAddress.trim()) {
      abstraction.defaults({ from: defaultAddress });
    }

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

