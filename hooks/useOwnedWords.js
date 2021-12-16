// import { useState, useEffect } from 'react';
import { useEthers, useContractCall } from '@usedapp/core';
import { utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';
// import useMintedWords from './useMintedWords';
import useContractAddress from './useContractAddress';

function useOwnedWords() {
  const { account } = useEthers();
  const contractAddress = useContractAddress();

  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const [ ownedWords ] = useContractCall(account && contractAddress && {
    abi: cryptoWordsInterface,
    address: contractAddress,
    method: 'getWordsByOwner',
    args: [account],
  }) ?? [];

  // const [ ownedWords, setOwnedWords ] = useState([]);
  // const mintedWords = useMintedWords();

  // useEffect(() => setOwnedWords(mintedWords.filter(w => w.owner === account)), [account, mintedWords]);

  return ownedWords;
}

export default useOwnedWords;