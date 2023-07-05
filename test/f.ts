// import { ethers } from 'hardhat'
// import { expect } from 'chai'
// import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/src/signers'
// import { ABC } from '../typechain-types'


// describe('SwapToken', async function () {
//   let user1: HardhatEthersSigner
//   let user2: HardhatEthersSigner
//   let Abc: any
//   let Xyz: any
//   let TokenSwap: any
//   let abc: any
//   let xyz: any
//   let tokenSwap: any
//   let tokenSwapAddress:string
//   let abcAddress:string

//   this.beforeEach(async () => {
//      [user1, user2] = await ethers.getSigners()
//     onst Abc = await ethers.getContractFactory('ABC', user1)
//     const Xyz = await ethers.getContractFactory('XYZ', user2)
//     const TokenSwap = await ethers.getContractFactory('TokenSwap', user1)

//     const abc = await Abc.deploy()
//     await abc.waitForDeployment()

//     const xyz = await Xyz.deploy()
//     await xyz.waitForDeployment()

//     const tokenSwap = await TokenSwap.deploy()
//     await tokenSwap.waitForDeployment()

//     const tokenSwapAddress = await tokenSwap.getAddress()
//     const abcAddress = await abc.getAddress()

//   })

//   // Happy path
//   it('Should swap token', async function () {
//     const WITHDRAWAMOUNTALLOWED = 1000000
//     // User 1 and user 2 allow tokenSwapAddress to withdraw WITHDRAWAMOUNTALLOWED amount
//     await abc.connect(user1).approve(tokenSwapAddress, WITHDRAWAMOUNTALLOWED)
//     await xyz.connect(user2).approve(tokenSwapAddress, WITHDRAWAMOUNTALLOWED)

//     // const amountReceiver = _getSwappedCurrencyToTokenAmount(xyz,amount)
//     const AMOUNTSENDER = 1000
//     const amountReceiver = await tokenSwap.connect(user1)._getSwappedCurrencyToTokenAmount(abcAddress, AMOUNTSENDER)

//     // User 1 or User 2 call swap function. tokenswap.connect(user1).swap(abc,100)
//     await tokenSwap.connect(user1).swap(abcAddress, AMOUNTSENDER)

//     // Swap successfully

//     // Check Logic
//     const xyzBalanceOfUser1 = await xyz.balanceOf(await user1.getAddress())
//     const abcBalanceOfUser2 = await abc.balanceOf(await user2.getAddress())

//     expect(xyzBalanceOfUser1).to.equal(amountReceiver)
//     expect(abcBalanceOfUser2).to.equal(AMOUNTSENDER)
//   })
// })
