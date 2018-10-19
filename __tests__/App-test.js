// import 'react-native';
// import React from 'react';
// import App from '../App';
// import renderer from 'react-test-renderer';
// import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
//
// describe('App snapshot', () => {
//   jest.useFakeTimers();
//   beforeEach(() => {
//     NavigationTestUtils.resetInternalState();
//   });
//   it('works', () => {
//     expect(1).toBe(1);
//   });
//   // it('renders the loading screen', async () => {
//   //   const tree = renderer.create(<App />).toJSON();
//   //   expect(tree).toMatchSnapshot();
//   // });
//   //
//   // it('renders the root without loading screen', async () => {
//   //   const tree = renderer.create(<App skipLoadingScreen />).toJSON();
//   //   expect(tree).toMatchSnapshot();
//   // });
// });
import XMLHttpRequest from 'XMLHttpRequest';

import '../src/global';
// import {Currency, generateWallet, toHexString} from "../src/utils";
import ethers from "ethers";
import {SecureStore} from "expo";
import {Alert} from "react-native";
import * as loomjs from "../src/network/web3/loom.umd";
import {toChecksumAddress} from "ethereumjs-util";
const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');


it('import from mnemonic', async () => {

  const mnemonic = 'logic eyebrow ship sell artist whale fade inside sentence magnet prefer render'
  const hex = await ethers.HDNode.mnemonicToEntropy(mnemonic)
  console.log(hex.substr(hex.length - 32))
  const path = "m/44'/60'/0'/0/0"
  const _newAccount = await ethers.Wallet.fromMnemonic(mnemonic, path);
  const privateKeyHex = _newAccount.privateKey
  const privateKeySeed = fromHexString(privateKeyHex.substr(privateKeyHex.length - 64))
  let privateKey = new Uint8Array(64)
  // // TODO: randomize
  privateKey.set(privateKeySeed);
  privateKey.set(privateKeySeed, privateKeySeed.length);

  const publicKey = loomjs.CryptoUtils.publicKeyFromPrivateKey(privateKey)
  const address = toChecksumAddress(loomjs.LocalAddress.fromPublicKey(publicKey).toString())
  console.log(privateKey)
  console.log(address)

});
//
//
// createAccount = async () => {
//  		// const { t, i18n } = this.props
//  		this.props.showProcessingModal('잠시만 기다려주세요')
//     let seed = await SecureStore.getItemAsync('seed')
// 		console.log("seed", seed)
//
//     if(seed && seed.length > 10) {
//     	 Alert.alert(
//           // t('wallet_already_exist', { locale: i18n.language }),
//           // t('wallet_already_exist_desc', { locale: i18n.language }),
// 				 	'Wallet Registered',
//           'Wallet is already registered',
//           [
//             { text: 'OK', onPress: () => this.navigateTo('Main', nav) }
//           ],
//           { cancelable: false}
//         )
// 			return
// 		}
// 		try {
// 	  	seed = await ethers.utils.randomBytes(16)
// 			await SecureStore.setItemAsync('seed', toHexString(seed))
//  			const wallet = await generateWallet(Currency.IFUM)
// 			if (wallet) {
// 	  		await this.props.addWallet(this.props.db, wallet)
// 			} else {
// 	  		// raise error
// 			}
// 			const mnemonic = await ethers.HDNode.entropyToMnemonic(seed)
// 			this.debounceNavigate('MnemonicBackup', {mnemonic: mnemonic})
// 		} catch(error) {
//     	console.log(error)
// 			// Alert.alert(
// 			// 	"Error",
// 			// 	error,
// 			// 	[
// 			// 		{ text: 'OK', onPress: () => {} }
// 			// 	],
// 			// 	{ cancelable: false}
// 			// )
// 		}
//   }