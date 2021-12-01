import { useContractCall } from '@usedapp/core';
import { utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';

function useInstancesAvailable(word) {
  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const [ instancesAvailable ] = useContractCall(word && {
    abi: cryptoWordsInterface,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    method: 'getInstancesAvailable',
    args: [word],
  }) ?? [];
  return instancesAvailable;
}

export default useInstancesAvailable;