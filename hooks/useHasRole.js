import { useContractCall } from '@usedapp/core';
import { utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';
import useContractAddress from './useContractAddress';

function useHasRole(role, account) {
  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const contractAddress = useContractAddress();
  const [ thisRole ] = useContractCall({
    abi: cryptoWordsInterface,
    address: contractAddress,
    method: role,
    args: []
  }) ?? [];

  const [ hasRole ] = useContractCall(thisRole && account && {
    abi: cryptoWordsInterface,
    address: contractAddress,
    method: 'hasRole',
    args: [thisRole, account]
  }) ?? [];

  return hasRole;
}

export default useHasRole;