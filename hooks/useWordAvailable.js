import { useContractCall } from '@usedapp/core';
import { utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';
import useContractAddress from './useContractAddress';

function useWordAvailable(word) {
  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const contractAddress = useContractAddress();
  const [ wordAvailable ] = useContractCall(word && {
    abi: cryptoWordsInterface,
    address: contractAddress,
    method: 'wordAvailable',
    args: [word],
  }) ?? [];
  return wordAvailable;
}

export default useWordAvailable;