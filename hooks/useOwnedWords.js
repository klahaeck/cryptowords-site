import { useState, useEffect } from 'react';
import { useEthers } from '@usedapp/core';
// import { utils } from 'ethers';
// import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';
import useMintedWords from './useMintedWords';

function useOwnedWords() {
  // const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  // const [ ownedWords ] = useContractCall(account && {
  //   abi: cryptoWordsInterface,
  //   address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  //   method: 'getWordsByOwner',
  //   args: [account],
  // }) ?? [];

  const { account } = useEthers();

  const [ ownedWords, setOwnedWords ] = useState([]);
  const mintedWords = useMintedWords();

  useEffect(() => setOwnedWords(mintedWords.filter(w => w.owner === account)), [account, mintedWords]);

  return ownedWords;
}

export default useOwnedWords;