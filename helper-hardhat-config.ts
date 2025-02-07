export type ChainId = number

type NetworkConfig = {
  name: string,
  ethUsdPriceFeed: string
}

export type NetworkName = 'hardhat' | 'sepolia' | 'polygon'

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || ''

export const networks: Record<NetworkName, { chainId: ChainId, rpcUrl?: string }> = {
  hardhat: {
    chainId: 31337
  },
  sepolia: {
    chainId: 11155111,
    rpcUrl: SEPOLIA_RPC_URL
  },
  polygon: {
    chainId: 137
  }
}

export const networkConfig: Record<ChainId, NetworkConfig> = {
  [networks.sepolia.chainId]: {
    name: 'sepolia',
    /** @see https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum */
    ethUsdPriceFeed: '0x694AA1769357215DE4FAC081bf1f309aDC325306'
  },
  [networks.polygon.chainId]: {
    name: 'polygon',
    ethUsdPriceFeed: '0xF0d50568e3A7e8259E16663972b11910F89BD8e7'
  }
}
