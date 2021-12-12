import { useState, useEffect } from 'react';
import { useEthers, ChainId } from '@usedapp/core';

function useCurrency() {
  const [ currency, setCurrency ] = useState('MATIC');
  const { chainId } = useEthers();

  useEffect(() => {
    const thisCurrency = chainId === ChainId.Polygon || chainId === ChainId.Mumbai ? 'MATIC' : 'ETH';
    setCurrency(thisCurrency);
  }, [chainId]);

  return currency;
}

export default useCurrency;