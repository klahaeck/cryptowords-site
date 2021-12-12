import { useContractCall } from '@usedapp/core';
import { utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';
import useContractAddress from './useContractAddress';

function usePrice(account, word) {
  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const contractAddress = useContractAddress();
  const [ price ] = useContractCall(account && word && {
    abi: cryptoWordsInterface,
    address: contractAddress,
    method: 'getPrice',
    args: [account, word]
  }) ?? [];
  return price;
}

export default usePrice;