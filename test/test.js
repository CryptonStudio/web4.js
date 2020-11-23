require('dotenv').config();
const fs = require('fs');
const { exit } = require('process');
const Web4 = require('./../index.js');

const abi = JSON.parse(fs.readFileSync("abi/ERC20.json", "utf8"));

var web4 = new Web4(
  process.env.OWNER_MNEMONIC,
  process.env.INFURA
);

erc20 = web4.getContractAbstraction(abi);
console.log(erc20.defaults());

const test = async () => {
  try {

    // to get tokens - send some ether to (rinkeby network) 0x43e982eA79499c21f6d1d3edf437E106AE64C14C
    // set gas limit ~100000 wei
    instance = await erc20.at("0x43e982eA79499c21f6d1d3edf437E106AE64C14C");

    console.log(await instance.name());
    console.log(await instance.symbol());
    console.log(await instance.decimals());

    instance.transfer("0xb346586D70396F8F7936eF8b225501c1EA841e4a", 1500000);

  } catch (err) {
    process.exit(1);
  }
}

test();
