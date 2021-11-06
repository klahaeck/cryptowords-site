import { useContractCall } from '@usedapp/core';
import { utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';

function useOwnedWords(account) {
  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const [ ownedWords ] = useContractCall(account && {
    abi: cryptoWordsInterface,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    method: 'getWordsByOwner',
    args: [account],
  }) ?? [];
  return ownedWords;
}

export default useOwnedWords;