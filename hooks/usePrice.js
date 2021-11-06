import { useContractCall } from '@usedapp/core';
import { utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';

function usePrice(account, word) {
  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const [ price ] = useContractCall(account && word && {
    abi: cryptoWordsInterface,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    method: 'getPrice',
    args: [account, word]
  }) ?? [];
  return price;
}

export default usePrice;