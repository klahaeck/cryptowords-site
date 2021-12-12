import { useContractCall } from '@usedapp/core';
import { utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';
import useContractAddress from './useContractAddress';

function useInstancesAvailable(word) {
  const contractAddress = useContractAddress();
  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const [ instancesAvailable ] = useContractCall(word && {
    abi: cryptoWordsInterface,
    address: contractAddress,
    method: 'getInstancesAvailable',
    args: [word],
  }) ?? [];
  return instancesAvailable;
}

export default useInstancesAvailable;