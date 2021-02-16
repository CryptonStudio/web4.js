require('dotenv').config();
const fs = require('fs');
const { exit } = require('process');
const Web4 = require('./../src/index');

const abi = JSON.parse(fs.readFileSync("./abi/ERC20.json", "utf8"));

const web4 = new Web4();

const Web3 = require("web3");

// web4.setProvider(new Web3.providers.WebsocketProvider(process.env.INFURA));
// // or you can set default account: web4.setProvider(new Web3.providers.WebsocketProvider(process.env.INFURA), "0x6551d4eb508c59002cb486e1ac2d341262d5bfe2");
// web4.privateKeyToAccount("0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709");

web4.setHDWalletProvider(
  process.env.MNEMONIC,
  // process.env.INFURA,
  new Web3.providers.WebsocketProvider(process.env.INFURA),  
);

const test = async () => {
  try {
    const erc20 = web4.getContractAbstraction(abi);
    console.log(erc20.defaults());

    // to get tokens - send some ether to (rinkeby network) 0x43e982eA79499c21f6d1d3edf437E106AE64C14C
    // set gas limit ~100000 wei    
    let instance = await erc20.getInstance("0x43e982eA79499c21f6d1d3edf437E106AE64C14C");    
    console.log(erc20.currentProvider.engine);

    console.log(await instance.name());
    console.log(await instance.symbol());
    console.log((await instance.decimals()).toString());

    console.log(instance.contract.events);

    let events = instance.contract.events.allEvents({
      fromBlock: '7600000'
    }, (error, result) => {
      console.log(result);
    }
    );

    console.log(await instance.transfer("0xb346586D70396F8F7936eF8b225501c1EA841e4a", 1500000));

    console.log(instance.contract.methods.transfer("0xb346586D70396F8F7936eF8b225501c1EA841e4a", 1500000).encodeABI());
    console.log(instance.encodeABI("transfer", "0xb346586D70396F8F7936eF8b225501c1EA841e4a", 1500000));

    //console.log(instance.sendTransactionWithETH);

  } catch (err) {
    process.exit(1);
  }
}

test();


