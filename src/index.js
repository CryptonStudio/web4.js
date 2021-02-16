const HDWalletProvider = require('@truffle/hdwallet-provider');
let contract = require("@truffle/contract");

function Web4() {
  let provider;
  let defaultAddress = "";
  let privateKey = "";

  this.setProvider = function (_provider, _address = "") {
    provider = _provider;
    defaultAddress = _address;    
  }
  
  // add private key to current web3 provider
  this.privateKeyToAccount = function (_privateKey) {
    privateKey = _privateKey;    
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

    // add account to current provider if defined
    if (privateKey.trim()) {      
      let account = abstraction.web3.eth.accounts.privateKeyToAccount(privateKey);
      abstraction.web3.eth.accounts.wallet.add(account);
      // set address as default
      defaultAddress = account.address;      
    }
    
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
        theArgs.unshift(method);
        let data = this.encodeABI.apply(this, theArgs);
        return this.sendTransaction({ value, data });
      }

      return instance;
    };

    return abstraction;
  }

};

module.exports = Web4;

