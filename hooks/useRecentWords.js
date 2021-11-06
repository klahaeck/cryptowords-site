import { useContractCall } from '@usedapp/core';
import { utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';

function useRecentWords(limit) {
  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const [ recentWords ] = useContractCall(limit && {
    abi: cryptoWordsInterface,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    method: 'getRecentWords',
    args: [limit]
  }) ?? [];
  return recentWords;
}

export default useRecentWords;