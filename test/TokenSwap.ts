import { ethers } from 'hardhat'
const { expect } = require('chai')
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/src/signers'
describe('SwapToken', async function () {
    let abc:any
    let xyz:any
    let tokenSwap: any;
    let user1: HardhatEthersSigner
    let user2: HardhatEthersSigner
    let admin: HardhatEthersSigner
    let tokenSwapAddress: string
    let abcAddress: string
    let xyzAddress: string
    let user1Address: string
    let user2Address: string
    let adminAddress: string
    this.beforeEach(async () => {
        const [user1, user2,admin] = await ethers.getSigners()
        const Abc = await ethers.getContractFactory('ABC', user1)
        const Xyz = await ethers.getContractFactory('XYZ', user2) 
        const TokenSwap = await ethers.getContractFactory('TokenSwap', admin)

        abc = await Abc.deploy()
        await abc.waitForDeployment()

        xyz = await Xyz.deploy()
        await xyz.waitForDeployment()

        const tokenSwap =  await TokenSwap.deploy()
        await tokenSwap.waitForDeployment()

        tokenSwapAddress = await tokenSwap.getAddress()
        abcAddress = await abc.getAddress()
        xyzAddress = await xyz.getAddress()
        user1Address = user1.address
        user2Address = user2.address
        adminAddress = admin.address
    })
    // Happy path
    it('Should Initialize', async function () {
        // Initialize
        const SWAPRATE = 125;
        const SWAPDECIMAL =2;
        await tokenSwap.connect(admin).initialize(abcAddress, xyzAddress, SWAPRATE, SWAPDECIMAL, user2Address, user1Address)
        expect(await tokenSwap.mainToken()).to.equal(abcAddress);
        expect(await tokenSwap.receiver()).to.equal(user2Address);
        expect(await tokenSwap.getSwappedCurrencyRate(xyzAddress)).to.equal(SWAPRATE);
        expect(await tokenSwap.getSwappedCurrencyDecimals(xyzAddress)).to.equal(SWAPDECIMAL);
    })
    it('Should swap token', async function () {
        // Initialize
        const SWAPRATE = 125;
        const SWAPDECIMAL =2;
        await tokenSwap.connect(admin).initialize(abcAddress, xyzAddress, SWAPRATE, SWAPDECIMAL, user2Address, user1Address)

        // User 1 and user 2 allow tokenSwapAddress to spend
        const WITHDRAWAMOUNTALLOWED = 1000000;

        await abc.connect(user1).approve(tokenSwapAddress, WITHDRAWAMOUNTALLOWED)
        await xyz.connect(user2).approve(tokenSwapAddress, WITHDRAWAMOUNTALLOWED)

        const AMOUNTSENDER = 1000
        const amountReceiver = await tokenSwap.connect(user1)._getSwappedCurrencyToTokenAmount(abcAddress, AMOUNTSENDER)        
        
        // User 1 or User 2 call swap function
        await tokenSwap.connect(user1).swap(abcAddress, AMOUNTSENDER)
   
        // Swap successfully

        const xyzBalanceOfUser1 = await xyz.connect(user1).balanceOf(user1)
        const abcBalanceOfUser2 = await abc.connect(user2).balanceOf(user2)

        expect(xyzBalanceOfUser1).to.equal(amountReceiver)
        expect(abcBalanceOfUser2).to.equal(AMOUNTSENDER)
    })
    // Unhappy path
    it('Should revert when caller is not user1 or user 2', async function () {
        // Initialize
        const SWAPRATE = 125;
        const SWAPDECIMAL =2;
        await tokenSwap.initialize(abcAddress, xyzAddress, SWAPRATE, SWAPDECIMAL, user2Address, user1Address)

        // User 1 and user 2 allow tokenSwapAddress to spend
        const WITHDRAWAMOUNTALLOWED = 1000000;

        await abc.connect(user1).approve(tokenSwapAddress, WITHDRAWAMOUNTALLOWED)
        await xyz.connect(user2).approve(tokenSwapAddress, WITHDRAWAMOUNTALLOWED)

        const AMOUNTSENDER = 1000
        
        // Admin call swap function
        await tokenSwap.connect(admin).swap(abcAddress, AMOUNTSENDER)
        await expect (tokenSwap.connect(admin).swap(abcAddress, AMOUNTSENDER)).revertedWith('UNAUTHORIZED');
    })
    it('Should revert when approve amount < amount sender', async function () {
        // Initialize
        const SWAPRATE = 125;
        const SWAPDECIMAL =2;
        await tokenSwap.initialize(abcAddress, xyzAddress, SWAPRATE, SWAPDECIMAL, user2Address, user1Address)

        // User 1 and user 2 allow tokenSwapAddress 
        const WITHDRAWAMOUNTALLOWED = 1000000;

        await abc.connect(user1).approve(tokenSwapAddress, WITHDRAWAMOUNTALLOWED)
        await xyz.connect(user2).approve(tokenSwapAddress, WITHDRAWAMOUNTALLOWED)

        const AMOUNTSENDER = WITHDRAWAMOUNTALLOWED+100
        const amountReceiver = await tokenSwap.connect(user1)._getSwappedCurrencyToTokenAmount(abcAddress, AMOUNTSENDER)        
        
        await tokenSwap.connect(user1).swap(abcAddress, AMOUNTSENDER)
        await expect (tokenSwap.connect(admin).swap(abcAddress, AMOUNTSENDER)).revertedWith('ERC20: insufficient allowance');
    })
})
