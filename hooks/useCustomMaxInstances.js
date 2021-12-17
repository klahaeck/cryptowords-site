import useSWR from 'swr';
import fetcher from '../lib/fetcher';
// import { useState, useEffect } from 'react';
import { useEthers } from '@usedapp/core';

function useCustomMaxInstances() {
  const { chainId } = useEthers();

  const { data, error } = useSWR(`/api/custom/max-instances?chainId=${chainId}`, fetcher);

  if (error) return [];
  if (!data) return [];
  return data;
}

export default useCustomMaxInstances;