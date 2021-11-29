import { ChainId, useEthers } from '@usedapp/core';
import {
  Container,
  Alert,
} from 'react-bootstrap';

const ChainChecker = () => {
  const { account, chainId } = useEthers();

  return (
    <Container className="mt-3">
      {account && chainId !== ChainId.Rinkeby && <Alert variant="danger"><h1>Stop!</h1><p>This is a test Web3 app that uses the Rinkeby network! Please switch to rinkeby before minting NFTs.</p></Alert>}
    </Container>
  );
};

export default ChainChecker;