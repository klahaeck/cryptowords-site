import { useEtherBalance, useContractCalls } from '@usedapp/core';
import { utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';

function useAdminData() {
  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const etherBalance = useEtherBalance(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const [ paused, maxInstances, defaultPrice, discountPercentage, discountPercentageGlobal ] = useContractCalls([
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
    {
      abi: cryptoWordsInterface,
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      method: 'discountPercentageGlobal',
      args: [],
    },
  ]) ?? [];
  return {
    paused: paused ? paused[0] : false,
    maxInstances: maxInstances ? Number(maxInstances) : 0,
    defaultPrice: defaultPrice ? defaultPrice.toString() : 0,
    discountPercentage: discountPercentage ? Number(discountPercentage) : 0,
    discountPercentageGlobal: discountPercentageGlobal ? Number(discountPercentageGlobal) : 0,
    balance: etherBalance ? etherBalance.toString()  : 0,
  };
}

export default useAdminData;