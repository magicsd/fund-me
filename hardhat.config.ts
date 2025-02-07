import type { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomicfoundation/hardhat-verify'
import '@typechain/hardhat'
import '@nomicfoundation/hardhat-ethers'
import '@nomicfoundation/hardhat-chai-matchers'
import '@nomiclabs/hardhat-waffle'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import 'dotenv/config'
import './tasks/block-number'

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ''
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || ''
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || ''
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ''

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  defaultNetwork: 'hardhat',
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: 11155111,
    },
    localhost: {
      url: 'http://127.0.0.1:8545/',
      chainId: 31337,
    },
  },
  sourcify: {
    enabled: true,
  },
  gasReporter: {
    enabled: false,
    offline: false,
    coinmarketcap: COINMARKETCAP_API_KEY,
    L1Etherscan: ETHERSCAN_API_KEY,
    outputFile: 'gas-report.txt',
    noColors: true,
    currency: 'USD',
  },
}

export default config
