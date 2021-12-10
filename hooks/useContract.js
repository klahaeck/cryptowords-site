import { useEthers } from '@usedapp/core';
import { ethers, utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';

function useContract() {
  const { library } = useEthers();
  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contract = new ethers.Contract( contractAddress, cryptoWordsInterface, library );
  return contract;
}

export default useContract;