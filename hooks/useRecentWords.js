import { useContractCall } from '@usedapp/core';
import { utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';
// import { useState, useEffect } from 'react';
// import useMintedWords from './useMintedWords';
import useContractAddress from './useContractAddress';

function useRecentWords(limit) {
  const contractAddress = useContractAddress();
  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const [ recentWords ] = useContractCall(limit && {
    abi: cryptoWordsInterface,
    address: contractAddress,
    method: 'getRecentWords',
    args: [limit]
  }) ?? [];

  // const [ recentWords, setRecentWords ] = useState([]);
  // const mintedWords = useMintedWords();

  // useEffect(() => setRecentWords(mintedWords.slice(-(limit || 15))), [mintedWords]);

  return recentWords;
}

export default useRecentWords;