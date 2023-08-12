const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../helper-hardhat-config")

const VRF_SUB_FUND_AMOUNT = ethers.parseEther("30")

module.exports = async ({ getNamedAccounts, deployments}) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let vrfCoordinatorV2Address, subscriptionId, VrfCoordinatorV2Mock

    if(developmentChains.includes(network.name)){
        VrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = VrfCoordinatorV2Mock.target
        const transactionResponse = await VrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait()
        console.log("---------..................-----------------")
        console.log(transactionReceipt.logs[0].args.subId)
        console.log("---------..................-----------------")
        
        subscriptionId = transactionReceipt.logs[0].args.subId
        console.log("---------.............subscriptionId.....-----------------")
        console.log(subscriptionId)
        console.log("---------..................-----------------")
        console.log(VrfCoordinatorV2Mock.target)
        await VrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT )
    } else{
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    const entranceFee = networkConfig[chainId]["entranceFee"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    //const interval = networkConfig[chainId]["interval"]
    const interval = 30
    /*
    console.log("---------------------------------------------------------------------intevdas")
    console.log( networkConfig[chainId])

    console.log("---------------------------------------------------------------------das")
    console.log(entranceFee)
    console.log(gasLane)
    console.log(callbackGasLimit)
    console.log(interval)
    console.log(vrfCoordinatorV2Address)*/
    const waitBlockConfirmations = developmentChains.includes(network.name) ? 1: VERIFICATION_BLOCK_CONFIRMATIONS

    const args = [
        vrfCoordinatorV2Address,
        subscriptionId,
        gasLane, // keyHash
        interval,
        entranceFee,
        callbackGasLimit
     ]
    
   // console.log("---------------------------------------------------------------------das")
   // console.log(waitBlockConfirmations)
  
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmation: waitBlockConfirmations,
        
    }) 
  //  console.log("---------------------------------------------------------------------3")
   // console.log(raffle)


    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        log("Verifying ..")
        await verify(raffle.address, args)
    }

    log("----------------------------------------")
}

module.exports.tags = ["all", "raffle"]