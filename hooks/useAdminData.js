import { useEtherBalance, useContractCalls } from '@usedapp/core';
import { utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';

function useAdminData() {
  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const etherBalance = useEtherBalance(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const [ totalSupply, paused, maxInstances, defaultPrice, discountPercentage ] = useContractCalls([
    {
      abi: cryptoWordsInterface,
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      method: 'totalSupply',
      args: [],
    },
    {
      abi: cryptoWordsInterface,
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      method: 'paused',
      args: [],
    },
    {
      abi: cryptoWordsInterface,
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      method: 'maxInstances',
      args: [],
    },
    {
      abi: cryptoWordsInterface,
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      method: 'defaultPrice',
      args: [],
    },
    {
      abi: cryptoWordsInterface,
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      method: 'discountPercentage',
      args: [],
    },
  ]) ?? [];
  return {
    totalSupply: totalSupply ? Number(totalSupply) : 0,
    paused: paused ? paused[0] : false,
    maxInstances: maxInstances ? Number(maxInstances) : 0,
    defaultPrice: defaultPrice ? defaultPrice.toString() : 0,
    discountPercentage: discountPercentage ? Number(discountPercentage) : 0,
    balance: etherBalance ? etherBalance.toString()  : 0,
  };
}

export default useAdminData;