import { useContractCall } from '@usedapp/core';
import { utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';

function useWordAvailable(word) {
  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const [ wordAvailable ] = useContractCall(word && {
    abi: cryptoWordsInterface,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    method: 'wordAvailable',
    args: [word],
  }) ?? [];
  return wordAvailable;
}

export default useWordAvailable;