const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

const maticmainnet_rpc_url = 'https://rpc-mainnet.matic.network'
const maticmumbai_rpc_url = "https://rpc-mumbai.maticvigil.com"

module.exports = {
    networks: {
        ganache: {
          host: "localhost",
          port: 7545,
          network_id: "*",
        },
		maticmainnet: {
        provider: () => new HDWalletProvider(mnemonic, maticmainnet_rpc_url),
			  network_id: '137',
		},
		maticmumbai: {
			
        provider: () => new HDWalletProvider(mnemonic, maticmumbai_rpc_url),
			  network_id: 80001,
        confirmations: 2,
        timeoutBlocks: 200,
        skipDryRun: true
		}
    } , 
    compilers : {
      solc :{
        version : '0.5.16'
      }
    }
};