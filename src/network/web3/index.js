import axios from 'axios'
import Web3 from 'web3'
import * as network from 'rediwallet/src/network/index'


const mainnet = new Web3(
  new Web3.providers.HttpProvider('https://mainnet.infura.io/'),
);

// const loom = new Web3(
//   new Web3.providers.HttpProvider('https://loom.socu.io/rpc'),
// );

const getBalance = async (address) => {
  console.log('in getBalance')
  try {
    // await mainnet.eth.getBalance(address).then(console.log)
    await mainnet.eth.getBalance(address).then(console.log)
  } catch (error) {
    console.log(error)
  }
}
//
// const doSignUp = async (signupData) => {
//   try {
//     const response = await axios.post(globals.API_SIGNUP, signupData)
//     return response
//   } catch(error) {
//     return error.response
//   }
// }
//
// const doSignIn = async (signinData) => {
//   try {
//     const response = await axios.post(globals.API_SIGNIN, signinData)
//     return response
//   } catch(error) {
//     return error.response
//   }
// }

export {
  // doSignUp,
  // doSignIn,
  getBalance,
}
