import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { developmentChainIds, networkConfig } from '../helper-hardhat-config'

const deployFunction: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  console.log('Deploying FundMe contract...')

  //@ts-ignore
  const { deployments, getNamedAccounts, network } = hre

  const { deploy, get, log } = deployments
  const { deployer } = await getNamedAccounts()

  const chainId = network.config.chainId

  if (!chainId) {
    throw new Error('ChainId not found')
  }

  let ethUsdPriceFeed: string

  if (developmentChainIds.includes(chainId)) {
    const ethUsdAggregator = await get('MockV3Aggregator')

    ethUsdPriceFeed = ethUsdAggregator.address
  } else {
    ethUsdPriceFeed = networkConfig[chainId].ethUsdPriceFeed
  }

  const fundMe = await deploy('FundMe', {
    from: deployer,
    args: [ethUsdPriceFeed],
    log: true,
  })

  console.log('---deployer', deployer)
  console.log('---chainId', chainId)
}

deployFunction.tags = ['all', 'fundMe']

export default deployFunction
