import hre from 'hardhat'
import type { FundMe, MockV3Aggregator } from '../../typechain-types'
import { expect } from 'chai'

type Address = string

const getAmount = (amount: number) => hre.ethers.parseEther(amount.toString())

describe('FundMe', async () => {
  let fundMe: FundMe
  let deployer: Address
  let mockV3Aggregator: MockV3Aggregator

  beforeEach(async () => {
    // returns accounts from network config
    // const accounts = await hre.ethers.getSigners()
    await hre.deployments.fixture(['all'])

    deployer = (await hre.getNamedAccounts()).deployer

    // gets most recently deployed contract FundMe
    fundMe = await hre.ethers.getContract('FundMe', deployer)
    mockV3Aggregator = await hre.ethers.getContract('MockV3Aggregator', deployer)
  })

  describe('constructor', async () => {
    it('sets the aggregator addresses correctly', async () => {
      const response = await fundMe.priceFeed()

      expect(response).to.equal(await mockV3Aggregator.getAddress())
    })

    it('sets the owner correctly', async () => {
      const response = await fundMe.I_OWNER()

      expect(response).to.equal(deployer)
    })
  })

  describe('fund', async () => {
    it('should revert if amount is not enough', async () => {
      const tx = fundMe.fund()

      await expect(tx).to.be.revertedWithCustomError(fundMe, "FundMe__InvalidAmount")
    })

    it('adds the sender to the funders list', async () => {
      const txResponse = await fundMe.fund({ value: getAmount(1) })

      await txResponse.wait(1)

      const funder = await fundMe.funders(0)

      expect(funder).to.equal(deployer)
    })

    it('adds correct entity to addressToAmountFunded', async () => {
      const txResponse = await fundMe.fund({ value: getAmount(1) })

      await txResponse.wait(1)

      const amountFunded = await fundMe.addressToAmountFunded(deployer)

      expect(amountFunded).to.equal(getAmount(1))
    })
  })

  describe('withdraw', async () => {
    const provider = hre.ethers.provider

    beforeEach(async () => {
      const txResponse = await fundMe.fund({ value: getAmount(1) })

      await txResponse.wait(1)
    })

    it('sends the correct amount to the owner', async () => {
      const fundMeAddress = await fundMe.getAddress()
      const contractBalanceBefore = await provider.getBalance(fundMeAddress)
      const deployerBalanceBefore = await provider.getBalance(deployer)

      const txResponse = await fundMe.withdraw()

      const txReceipt = await txResponse.wait(1)

      if (!txReceipt) {
        throw new Error('Transaction receipt not found')
      }

      const gasCost = txReceipt.gasUsed * txResponse.gasPrice

      const contractBalanceAfter = await provider.getBalance(fundMeAddress)
      const deployerBalanceAfter = await provider.getBalance(deployer)

      expect(contractBalanceAfter).to.equal(0)
      expect(deployerBalanceAfter + gasCost).to.equal(contractBalanceBefore + deployerBalanceBefore)
    })

    // it('reverts if the sender is not the owner', async () => {
    //   const [, user] = await hre.ethers.getSigners()
    //
    //   const tx = fundMe.withdraw()
    //
    //   await expect(tx).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner")
    // })
  })
})
