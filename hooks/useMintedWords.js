import { useState, useEffect } from 'react';
import useContract from './useContract';

function useMintedWords() {
  const [ mintedWords, setMintedWords ] = useState(null);

  const contract = useContract();
  const eventFilter = contract.filters.WordMinted();

  const wordMintedHandler = (tokenId, word, to) => {
    setMintedWords([...mintedWords, { tokenId: tokenId.toString(), word, owner: to }]);
    console.log(mintedWords);
  };

  useEffect(() => {
    async function init() {
      const events = await contract.queryFilter(eventFilter);
      const eventsMapped = events.map((event) => {
        return {
          tokenId: event.args.tokenId.toString(),
          word: event.args.word,
          owner: event.args.to
        };
      });
      setMintedWords(eventsMapped);
      contract.on('WordMinted', wordMintedHandler);
      // setLoaded(true);
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

  return { mintedWords };
};

export default useMintedWords;