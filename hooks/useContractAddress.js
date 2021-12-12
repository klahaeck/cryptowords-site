import { useState, useEffect } from 'react';
import { useEthers, ChainId } from '@usedapp/core';

function useContractAddress() {
  const [ contractAddress, setContractAddress ] = useState(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_POLYGON);
  const { chainId } = useEthers();

  useEffect(() => {
    const thisContractAddress = chainId === ChainId.Hardhat ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_HARDHAT :
                          chainId === ChainId.Mainnet ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MAINNET :
                          chainId === ChainId.Ropsten ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_ROPSTEN :
                          chainId === ChainId.Mumbai ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MUMBAI :
                          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_POLYGON;
    
    setContractAddress(thisContractAddress);
  }, [chainId]);

  return contractAddress;
}

export default useContractAddress;