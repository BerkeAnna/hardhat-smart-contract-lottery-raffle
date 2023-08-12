const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const { assert } = require("chai")

!developmentChains.includes(network.name) ? describe.skip : describe("Raffle", async function() {
    let raffle, vrfCoordinatorV2Mock
    const chainId = network.config.chainId

    beforeEach( async function (){
        const {deployer}  = await getNamedAccounts
        await deployments.fixture(["all"])
        raffle = await ethers.getContract("Raffle", deployer)
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)

    })
    describe("constractor", async function(){
        it("initializes the raffle correctly", async function(){
            const raffleState = await raffle.getRaffleState()
            const interval = await raffle.getInterval()
            assert.equal(raffleState.toString(), "0")
            //TODO: 30 -> networkConfig[chainId]["interval"]
            assert.equal(interval.toString(), "30")
        })
    })
})
