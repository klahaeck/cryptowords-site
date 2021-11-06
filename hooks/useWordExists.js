import { useContractCall } from '@usedapp/core';
import { utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';

function useWordExists(word) {
  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const [ wordExists ] = useContractCall(word && {
    abi: cryptoWordsInterface,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    method: 'wordExists',
    args: [word],
  }) ?? [];
  return wordExists;
}

export default useWordExists;