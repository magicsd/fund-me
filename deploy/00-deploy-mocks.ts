import type { DeployFunction } from 'hardhat-deploy/types'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DECIMALS, developmentChainIds, INITIAL_ANSWER } from '../helper-hardhat-config'

const deployFunction: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  //@ts-ignore
  const { deployments, getNamedAccounts, network } = hre

  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const chainId = network.config.chainId

  if (!chainId) {
    throw new Error('ChainId not found')
  }

  if (!developmentChainIds.includes(chainId)) return

  log('Localhost detected, deploying mocks...')

  await deploy('MockV3Aggregator', {
    contract: 'MockV3Aggregator',
    from: deployer,
    log: true,
    args: [DECIMALS, INITIAL_ANSWER],
  })

  log('Mocks deployed!')
  log('----------------------------------------------------')
}

deployFunction.tags = ['all', 'mocks']

export default deployFunction
