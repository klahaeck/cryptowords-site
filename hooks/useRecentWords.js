// import { useContractCall } from '@usedapp/core';
// import { utils } from 'ethers';
// import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';
import { useState, useEffect } from 'react';
import useMintedWords from './useMintedWords';

function useRecentWords(limit) {
  // const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  // const [ recentWords ] = useContractCall(limit && {
  //   abi: cryptoWordsInterface,
  //   address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  //   method: 'getRecentWords',
  //   args: [limit]
  // }) ?? [];
  
  const [ recentWords, setRecentWords ] = useState(null);
  const { mintedWords } = useMintedWords();

  useEffect(() => {
    setRecentWords(mintedWords);
  }, [mintedWords]);

  return { recentWords };
}

export default useRecentWords;