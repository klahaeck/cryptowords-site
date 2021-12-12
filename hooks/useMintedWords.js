import { useState, useEffect } from 'react';
import useContract from './useContract';

function useMintedWords() {
  const [ mintedWords, setMintedWords ] = useState([]);

  const { contract } = useContract();
  const eventFilter = contract.filters.WordMinted();

  const wordMintedHandler = (tokenId, word, to) => {
    setMintedWords([...mintedWords, { tokenId: tokenId.toString(), word, owner: to }]);
  };

  useEffect(() => {
    async function init() {
      // const localstorageWords = JSON.parse(localStorage.getItem('MintedWords'));
      // if (!localstorageWords) {
      const events = await contract.queryFilter(eventFilter);
      const eventsMapped = events.map((event) => ({
        tokenId: event.args.tokenId.toString(),
        word: event.args.word,
        owner: event.args.to
      }));
      setMintedWords(eventsMapped);
      // } else {
      //   setMintedWords(localstorageWords);
      // }
      
      contract.on('WordMinted', wordMintedHandler);
    }
    if (contract.provider) {
      init();
    }

    return () => {
      if (contract.provider) {
        contract.off('WordMinted', wordMintedHandler);
      }
    }
  }, [contract.provider]);

  // useEffect(() => {
  //   if (mintedWords !== JSON.parse(localStorage.getItem('MintedWords'))) {
  //     console.log('localstorage');
  //     localStorage.setItem('MintedWords', JSON.stringify(mintedWords));
  //   }
  // }, [mintedWords]);

  return mintedWords;
};

export default useMintedWords;