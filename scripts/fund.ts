import { getNamedAccounts, ethers } from 'hardhat'
import type { FundMe } from '../typechain-types'

async function main() {
  const { deployer } = await getNamedAccounts()

  const fundMe = await ethers.getContract('FundMe', deployer) as FundMe

  console.log('Funding contract...')

  const txResponse = await fundMe.fund({ value: ethers.parseEther('0.1') })

  await txResponse.wait(1)

  console.log('Funded contract!')
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
