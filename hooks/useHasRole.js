import { useContractCall } from '@usedapp/core';
import { utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';

function useHasRole(role, account) {
  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const [ thisRole ] = useContractCall({
    abi: cryptoWordsInterface,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    method: role,
    args: []
  }) ?? [];

  const [ hasRole ] = useContractCall(thisRole && account && {
    abi: cryptoWordsInterface,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    method: 'hasRole',
    args: [thisRole, account]
  }) ?? [];

  return hasRole;
}

export default useHasRole;