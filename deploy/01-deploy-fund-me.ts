import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { developmentChainIds, networkConfig } from '../helper-hardhat-config'
import { verify } from '../utils/verify'

const deployFunction: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  //@ts-ignore
  const { deployments, getNamedAccounts, network } = hre

  const { deploy, get, log } = deployments
  const { deployer } = await getNamedAccounts()

  const chainId = network.config.chainId

  log('ChainId:', chainId)

  if (!chainId) {
    throw new Error('ChainId not found')
  }

  let ethUsdPriceFeed: string

  const isDevChain = developmentChainIds.includes(chainId)

  if (isDevChain) {
    const ethUsdAggregator = await get('MockV3Aggregator')

    ethUsdPriceFeed = ethUsdAggregator.address
  } else {
    ethUsdPriceFeed = networkConfig[chainId].ethUsdPriceFeed
  }

  log('Deploying FundMe contract...')

  const deployArgs = [ethUsdPriceFeed]

  const fundMe = await deploy('FundMe', {
    from: deployer,
    args: deployArgs,
    log: true,
  })

  if (!isDevChain && process.env.ETHERSCAN_API_KEY) {
    log('Verifying FundMe contract...')

    await verify(fundMe.address, deployArgs)
  }
}

deployFunction.tags = ['all', 'fundMe']

export default deployFunction
