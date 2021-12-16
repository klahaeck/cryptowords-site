import { useState, useEffect } from 'react';
import { useBlockNumber } from '@usedapp/core';
import useContract from './useContract';

function useMintedWords() {
  const [ mintedWords, setMintedWords ] = useState([]);
  const [ lastBlockNumber, setLastBlockNumber ] = useState();
  const blockNumber = useBlockNumber();

  const contract = useContract();

  // const wordMintedHandler = (tokenId, word, to) => {
  //   setMintedWords([...mintedWords, { tokenId: tokenId.toString(), word, owner: to }]);
  // };

  useEffect(() => {
    async function init() {
      // console.log('blockNumber:', blockNumber);
      // const localstorageWords = JSON.parse(localStorage.getItem('MintedWords'));
      // if (!localstorageWords) {
      const startBlock = lastBlockNumber ? lastBlockNumber : blockNumber - 10000;
      const eventFilter = contract.filters.WordMinted();
      const events = await contract.queryFilter(eventFilter, startBlock);
      const eventsMapped = events.map((event) => ({
        tokenId: event.args.tokenId.toString(),
        word: event.args.word,
        owner: event.args.to
      }));
      setMintedWords([...mintedWords, ...eventsMapped]);
      // } else {
      //   setMintedWords(localstorageWords);
      // }      
      // contract.on('WordMinted', wordMintedHandler);

      setLastBlockNumber(blockNumber);
    }
    if (contract?.provider && blockNumber) {
      init();
    }

    // return () => {
    //   if (contract?.provider) {
    //     contract.off('WordMinted', wordMintedHandler);
    //   }
    // }
  }, [contract, blockNumber]);

  // useEffect(() => {
  //   if (mintedWords !== JSON.parse(localStorage.getItem('MintedWords'))) {
  //     console.log('localstorage');
  //     localStorage.setItem('MintedWords', JSON.stringify(mintedWords));
  //   }
  // }, [mintedWords]);

  return mintedWords;
};

export default useMintedWords;