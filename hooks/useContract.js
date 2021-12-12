import { useState, useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import { ethers, utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';
import useContractAddress from './useContractAddress';

function useContract() {
  const [ contract, setContract ] = useState();
  const { library } = useEthers();
  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const contractAddress = useContractAddress();

  useEffect(() => {
    const thisContract = new ethers.Contract( contractAddress, cryptoWordsInterface, library );
    setContract(thisContract);
  }, [contractAddress]);

  return contract;
}

export default useContract;