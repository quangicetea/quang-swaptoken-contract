import { ethers, hardhatArguments } from 'hardhat'
async function main() {
    // const abc = await ethers.deployContract('ABC')
    // abc.waitForDeployment()
    // console.log('ABC address: ', await abc.getAddress())
    // const xyz = await ethers.deployContract('XYZ')
    // xyz.waitForDeployment()
    // console.log('XYZ address: ', await xyz.getAddress())
    const swap = await ethers.deployContract('TokenSwap')
    swap.waitForDeployment()
    console.log('TokenSwap address: ', await swap.getAddress())
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
