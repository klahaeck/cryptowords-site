import useSWR from 'swr';
import fetcher from '../lib/fetcher';
// import { useState, useEffect } from 'react';
import { useEthers, useContractCall } from '@usedapp/core';
import { utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';
import useContractAddress from './useContractAddress';

function useRoleMembers(role) {
  // const [ thisCalls, setThisCalls ] = useState([]);
  const { chainId } = useEthers();
  const contractAddress = useContractAddress();

  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  
  const [ thisRole ] = useContractCall({
    abi: cryptoWordsInterface,
    address: contractAddress,
    method: role,
    args: []
  }) ?? [];

  // const [ memberCount ] = useContractCall(thisRole && {
  //   abi: cryptoWordsInterface,
  //   address: contractAddress,
  //   method: 'getRoleMemberCount',
  //   args: [thisRole]
  // }) ?? [];

  // const members = useContractCalls(thisCalls);

  // useEffect(() => {
  //   if (Number(memberCount) > 0) {
  //     const newCalls = Array(Number(memberCount)).fill().map((number, index) => ({
  //       abi: cryptoWordsInterface,
  //       address: contractAddress,
  //       method: 'getRoleMember',
  //       args: [thisRole, index]
  //     }));
  //     setThisCalls(newCalls);
  //   }
  // }, [memberCount]);

  // return [thisRole, [].concat(...members)];

  const { data, error } = useSWR(role ? `/api/roles/${role.replace('_ROLE', '').toLowerCase()}?chainId=${chainId}` : null, fetcher);

  if (error) return [ thisRole, [] ];
  if (!data) return [ thisRole, [] ];
  return [ thisRole, data ];
}

export default useRoleMembers;