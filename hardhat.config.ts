import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomicfoundation/hardhat-verify'

const config: HardhatUserConfig = {
    solidity: '0.8.18',
    networks: {
        goerli: {
            url: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
            accounts: [process.env.PRIV_KEY],
        },
    },
    etherscan: {
        apiKey: process.env.API_KEY,
    },
}

export default config
