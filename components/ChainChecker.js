import { getChainName, useEthers } from '@usedapp/core';
import {
  Container,
  Alert,
} from 'react-bootstrap';

const ChainChecker = () => {
  const { account, chainId } = useEthers();

  return (
    <Container className="mt-3">
      {account && chainId !== parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) && <Alert variant="danger"><h1>Stop!</h1><p>This app uses the <b>{getChainName(process.env.NEXT_PUBLIC_CHAIN_ID)}</b> network. You are currently using the <b>{getChainName(chainId)}</b> network. Please change accordingly.</p></Alert>}
    </Container>
  );
};

export default ChainChecker;