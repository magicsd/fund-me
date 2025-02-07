import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

const deployFunction: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  console.log('Deploying FundMe contract...')

  //@ts-ignore
  const { deployments, getNamedAccounts, network } = hre

  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const chainId = network.config.chainId

  console.log('---deployer', deployer)
  console.log('---chainId', chainId)
}

export default deployFunction
