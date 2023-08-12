const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")


!developmentChains.includes(network.name) ? describe.skip : describe("Raffle", async function() {
    let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer
    const chainId = network.config.chainId

    beforeEach( async function (){
        deployer = (await getNamedAccounts).deployer
        await deployments.fixture(["all"])
        raffle = await ethers.getContract("Raffle", deployer)
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
        raffleEntranceFee = await raffle.getEntranceFee()

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

    describe("enter raffle", async function() {
        it("reverts when you don't pay enough", async function() {
            await expect(raffle.enterRaffle()).to.be.revertedWith("Raffle__SendMoreToEnterRaffle");


        })
        it("records players when they enter", async function(){
            await raffle.enterRaffle({ value: raffleEntranceFee })
            const playerFromContract = await raffle.getPlayer(0)
            assert.equal(playerFromContract, deployer)
        })
    })
})
