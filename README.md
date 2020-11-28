# Web4 Ethereum JavaScript API 

# Install

```bash
$ npm install @cryptonteam/web4
```

# Usage

Read from contract, send transaction, get events.
```js

require('dotenv').config();
const fs = require('fs');
const Web4 = require('@cryptonteam/web4');

const abi = JSON.parse(fs.readFileSync("abi/ERC20.json", "utf8"));

const web4 = new Web4();

web4.setHDWalletProvider(
  process.env.OWNER_MNEMONIC,
  process.env.INFURA
);

// or you can use: web4.setProvider(web3Provider);

// you can add account by private key
// web4.privateKeyToAccount("0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709");

erc20 = web4.getContractAbstraction(abi);

let test = async () => {
  
  instance = await erc20.getInstance("0xcbc351b996e6d724a0d3d351ad5953990348cf40");

  console.log(await instance.name());
  console.log(await instance.symbol());
  console.log(await instance.decimals());

  console.log(await instance.transfer("0xb346586D70396F8F7936eF8b225501c1EA841e4a", 1500000));

  // to get encoded abi call use:
  console.log(instance.encodeABI("transfer", "0xb346586D70396F8F7936eF8b225501c1EA841e4a", 1500000));

  // to get event you can use:
  let events = instance.contract.events.allEvents({
      fromBlock: '7600000'
  }, (error, result) => {
      console.log(result);
  });

  return true;
}

test();
```
