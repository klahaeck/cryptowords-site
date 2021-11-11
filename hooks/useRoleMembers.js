import { useState, useEffect } from 'react';
import { useContractCall, useContractCalls } from '@usedapp/core';
import { utils } from 'ethers';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';

function useRoleMembers(role) {
  const [ thisCalls, setThisCalls ] = useState([]);

  const cryptoWordsInterface = new utils.Interface(CryptoWordsV1.abi);
  const [ thisRole ] = useContractCall({
    abi: cryptoWordsInterface,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    method: role,
    args: []
  }) ?? [];

  const [ memberCount ] = useContractCall(thisRole && {
    abi: cryptoWordsInterface,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    method: 'getRoleMemberCount',
    args: [thisRole]
  }) ?? [];

  const [ members ] = useContractCalls(memberCount > 0 && thisCalls?.length > 0 ? thisCalls : []) ?? [];

  useEffect(() => {
    if (memberCount > 0) {
      const newCalls = Array(memberCount).map((number, index) => ({
        abi: cryptoWordsInterface,
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        method: 'getRoleMember',
        args: [thisRole, index]
      }));
      setThisCalls(newCalls);
    }
  }, [memberCount]);

  return [thisRole, members];
}

export default useRoleMembers;