import { ethers } from 'hardhat'
const { expect } = require('chai')
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/src/signers'
describe('SwapToken', async function () {
        const [user1, user2] = await ethers.getSigners()
        const Abc = await ethers.getContractFactory('ABC', user1)
        const Xyz = await ethers.getContractFactory('XYZ', user2)
        const TokenSwap = await ethers.getContractFactory('TokenSwap', user1)

        const abc = await Abc.deploy()
        await abc.waitForDeployment()

        const xyz = await Xyz.deploy()
        await xyz.waitForDeployment()

        const tokenSwap = await TokenSwap.deploy()
        await tokenSwap.waitForDeployment()

        const tokenSwapAddress = await tokenSwap.getAddress()
        const abcAddress = await abc.getAddress()
        const xyzAddress = await xyz.getAddress()
        const user1Address = user1.address
        const user2Address = user2.address

    // Happy path
    it('Should swap token', async function () {
        // Initialize
        const SWAPRATE = 125;
        const SWAPDECIMAL =2;
        await tokenSwap.initialize(abcAddress, xyzAddress, SWAPRATE, SWAPDECIMAL, user2Address, user1Address)

       
        // User 1 and user 2 allow tokenSwapAddress to withdraw WITHDRAWAMOUNTALLOWED amount
        const WITHDRAWAMOUNTALLOWED = 1000000;

        await abc.connect(user1).approve(tokenSwapAddress, WITHDRAWAMOUNTALLOWED)
        await xyz.connect(user2).approve(tokenSwapAddress, WITHDRAWAMOUNTALLOWED)

        // const amountReceiver = _getSwappedCurrencyToTokenAmount(xyz,amount)
        const AMOUNTSENDER = 1000
        const amountReceiver = await tokenSwap.connect(user1)._getSwappedCurrencyToTokenAmount(abcAddress, AMOUNTSENDER)        
        
        // User 1 or User 2 call swap function. tokenswap.connect(user1).swap(abc,100)
        await tokenSwap.swap(abcAddress, AMOUNTSENDER)
        
        // Swap successfully

        // Check Logic
        const xyzBalanceOfUser1 = await xyz.balanceOf(user1)
        const abcBalanceOfUser2 = await abc.balanceOf(user2)

        expect(xyzBalanceOfUser1).to.equal(amountReceiver)
        expect(abcBalanceOfUser2).to.equal(AMOUNTSENDER)
    })
})
