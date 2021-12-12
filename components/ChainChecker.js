import { getChainName, isTestChain, useEthers } from '@usedapp/core';
import {
  Container,
  Alert,
} from 'react-bootstrap';

const ChainChecker = () => {
  const { account, chainId } = useEthers();

  return (
    <Container className="mt-3">
      {account && isTestChain(chainId) && <Alert variant="info"><p className="m-0 p-0">You are currently on the <b>{getChainName(chainId)}</b> test network. All transactions are for testing purposes only!</p></Alert>}
    </Container>
  );
};

export default ChainChecker;