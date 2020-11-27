# Web4 Ethereum JavaScript API 

# Install

```bash
$ npm install @cryptonteam/web4
```

# Usage

Send coins
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

erc20 = web4.getContractAbstraction(abi);

let test = async () => {
  
  instance = await erc20.getInstance("0xcbc351b996e6d724a0d3d351ad5953990348cf40");

  console.log(await instance.name());
  console.log(await instance.symbol());
  console.log(await instance.decimals());

  return true;
}

test();
```
