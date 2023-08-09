const { ethers } = require("hardhat")

const networkConfig = {
    11155111:{
        name: "sepolia",
        vrfCoordinatorV2: "0x5fb1616F78dA7aFC9FF79e0371741a747D2a7F22",
        entranceFee: ethers.utils.parseEther("0.01"),

    },
    31337:{
        name: "hardhat",
        entranceFee: ethers.utils.parseEther("0.01"),
        
    }
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
        networkConfig,
        developmentChains
}