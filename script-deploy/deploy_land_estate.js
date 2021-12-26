const LANDRegistry = artifacts.require('LANDRegistry')
const EstateRegistry = artifacts.require('EstateRegistry')
const LANDProxy = artifacts.require('LANDProxy')
const MiniMeToken = artifacts.require('MiniMeToken')

const execVerifyCmd = require('./publish_code')

const networkIdName = {
  137: 'maticmainnet',
  80001: 'matictestnet'
}

const ESTATE_NAME = 'Estate'
const ESTATE_SYMBOL = 'EST'

const LAND_NAME = 'Decentraland LAND'
const LAND_SYMBOL = 'LAND'

const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'

async function setupContracts(creator, creationParams) {
  const sentByCreator = { ...creationParams, from: creator }

  // const LANDRegistry = artifacts.require('LANDRegistryTest')
  // const EstateRegistry = artifacts.require('EstateRegistryTest')
  // const LANDProxy = artifacts.require('LANDProxy')
  // const MiniMeToken = artifacts.require('MiniMeToken')

  const landMinimeToken = await MiniMeToken.new(
    EMPTY_ADDRESS,
    EMPTY_ADDRESS,
    0,
    LAND_NAME,
    18,
    LAND_SYMBOL,
    false,
    creationParams
  )
  const estateMinimeToken = await MiniMeToken.new(
    EMPTY_ADDRESS,
    EMPTY_ADDRESS,
    0,
    ESTATE_NAME,
    18,
    ESTATE_SYMBOL,
    false,
    creationParams
  )

  const proxy = await LANDProxy.new(creationParams)
  console.log('Deployed LANDProxy:', proxy.address)

  const registry = await LANDRegistry.new(creationParams)
  console.log('Deployed LANDRegistry:', registry.address)

  let tx = await proxy.upgrade(registry.address, creator, sentByCreator)
  console.log('proxy.upgrade tx:', tx.receipt.transactionHash)

  // Estate does not use Proxy like for Land
  const estate = await EstateRegistry.new(creationParams)
  console.log('Deployed EstateRegistry:', estate.address)
  
  tx = await estate.initialize(ESTATE_NAME, ESTATE_SYMBOL, proxy.address)
  console.log('estate.initialize tx:', tx.receipt.transactionHash)

  const land = await LANDRegistry.at(proxy.address)
  await land.initialize(creator, sentByCreator)
  await land.setEstateRegistry(estate.address)

  await landMinimeToken.changeController(land.address, sentByCreator)
  await land.setLandBalanceToken(landMinimeToken.address)

  await estateMinimeToken.changeController(estate.address, sentByCreator)
  await estate.setEstateLandBalanceToken(estateMinimeToken.address)

  return {
    proxy,
    registry,
    estate,
    land
  }
}

async function getCreatorAccount(web3) {
  return new Promise((resolve, reject) => {
    web3.eth
      .getAccounts()
      .then(res => resolve(res[0]))
      .catch(err => resolve(null))
  })
}

module.exports = async function(callback) {
  try {
    const networkId = await web3.eth.net.getId()
    const networkName = networkIdName[networkId]

    console.log('networkName:', networkName)

    const creator = await getCreatorAccount(web3)
    console.log('creator:', creator)

    const user = creator
    const operator = creator
    const anotherUser = creator

    const creationParams = {
      gas: 7e6,
      gasPrice: 20000000000, // 20 Gwei (Matic testnet)
      from: creator
    }

    const sentByUser = { ...creationParams, from: user }
    const sentByCreator = { ...creationParams, from: creator }
    const sentByOperator = { ...creationParams, from: operator }
    const sentByAnotherUser = { ...creationParams, from: anotherUser }

    const contracts = await setupContracts(creator, creationParams)
    const estate = contracts.estate
    const land = contracts.land

    let tx = await land.authorizeDeploy(creator, sentByCreator)
    console.log('land.authorizeDeploy tx:', tx.receipt.transactionHash)

    tx = await land.assignNewParcel(0, 1, user, sentByCreator)
    console.log('land.assignNewParcel tx:', tx.receipt.transactionHash)

    tx = await land.assignNewParcel(0, 2, user, sentByCreator)
    console.log('land.assignNewParcel tx:', tx.receipt.transactionHash)

    tx = await land.ping(sentByUser)
    console.log('land.ping tx:', tx.receipt.transactionHash)
  } catch (error) {
    console.log(error)
  }

  callback()

  process.exit(0)
}
