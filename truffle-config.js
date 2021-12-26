require('babel-register')
require('babel-polyfill')

// const HDWalletProvider = require('truffle-hdwallet-provider')
const HDWalletProvider = require('@truffle/hdwallet-provider')

const fs = require('fs')
const path = require('path')

module.exports = {
  contracts_directory: 'contracts',
  compilers: {
    solc: {
      version: '^0.4.18',
      parser: 'solcjs',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      gas: 4000000,
      network_id: '*'
    },
    matictestnet: {
      provider: () => {
        const privatekey = fs
          .readFileSync(`${path.dirname(__filename)}/.secret.matictestnet`)
          .toString()
        return new HDWalletProvider(
          privatekey,
          // 'https://rpc-mumbai.maticvigil.com/'
          // 'wss://ws-matic-mumbai.chainstacklabs.com'
          'wss://matic-testnet-archive-ws.bwarelabs.com'
        )
      },
      network_id: 80001,
      // chainId: 80001,
      confirmations: 2,
      timeoutBlocks: 50000,
      networkCheckTimeout: 1000000,
      skipDryRun: true,
      gas: 7000000,
      gasPrice: 5000000000 // 5 Gwei
    },
    maticmainnet: {
      provider: () => {
        const privatekey = fs
          .readFileSync(`${path.dirname(__filename)}/.secret.maticmainnet`)
          .toString()
        return new HDWalletProvider(
          privatekey,
          'https://rpc-mainnet.maticvigil.com/'
        )
      },
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 4000000,
      gasPrice: 50000000000 // 50 Gwei
    }
  }
}
