import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';

function useContract() {
  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contract = new Contract(contractAddress, cryptoWordsInterface);
  return contract;
}

export default useContract;