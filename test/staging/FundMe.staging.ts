import hre from 'hardhat'
import type { FundMe } from '../../typechain-types'
import { developmentChainIds } from '../../helper-hardhat-config'
import { expect } from 'chai'

type Address = string

const getAmount = (amount: number) => hre.ethers.parseEther(amount.toString())

const isDevNetwork = hre.network.config.chainId && developmentChainIds.includes(hre.network.config.chainId)

isDevNetwork ? describe.skip : describe('FundMe', async () => {
  let fundMe: FundMe
  let deployer: Address

  beforeEach(async () => {
    deployer = (await hre.getNamedAccounts()).deployer
    fundMe = await hre.ethers.getContract('FundMe', deployer)
  })

  it('allows fund and withdraw', async () => {
    await fundMe.fund({ value: getAmount(0.05) })
    await fundMe.withdraw()

    const fundMeAddress = await fundMe.getAddress()

    const balanceAfter = await hre.ethers.provider.getBalance(fundMeAddress)

    expect(balanceAfter).to.equal(0)
  })
})
