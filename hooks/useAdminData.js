import { useEtherBalance, useContractCalls } from '@usedapp/core';
import { utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';
import useContractAddress from './useContractAddress';

function useAdminData() {
  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const contractAddress = useContractAddress();
  const etherBalance = useEtherBalance(contractAddress);
  const [ totalSupply, paused, maxInstances, defaultPrice, discountPercentage, discountPercentageGlobal ] = useContractCalls([
    {
      abi: cryptoWordsInterface,
      address: contractAddress,
      method: 'totalSupply',
      args: [],
    },
    {
      abi: cryptoWordsInterface,
      address: contractAddress,
      method: 'paused',
      args: [],
    },
    {
      abi: cryptoWordsInterface,
      address: contractAddress,
      method: 'maxInstances',
      args: [],
    },
    {
      abi: cryptoWordsInterface,
      address: contractAddress,
      method: 'defaultPrice',
      args: [],
    },
    {
      abi: cryptoWordsInterface,
      address: contractAddress,
      method: 'discountPercentage',
      args: [],
    },
    {
      abi: cryptoWordsInterface,
      address: contractAddress,
      method: 'discountPercentageGlobal',
      args: [],
    },
  ]) ?? [];
  return {
    totalSupply: totalSupply && totalSupply.toString(),
    paused: paused && paused[0],
    maxInstances: maxInstances && Number(maxInstances),
    defaultPrice: defaultPrice && defaultPrice.toString(),
    discountPercentage: discountPercentage && Number(discountPercentage),
    discountPercentageGlobal: discountPercentageGlobal && Number(discountPercentageGlobal),
    balance: etherBalance && etherBalance.toString(),
  };
}

export default useAdminData;