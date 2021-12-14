import { getChainName, isTestChain, useEthers, ChainId, useEtherBalance } from '@usedapp/core';
import { utils } from 'ethers';
import {
  Container,
  Alert,
  Row,
  Col,
  Button
} from 'react-bootstrap';

const ChainChecker = () => {
  const { account, chainId } = useEthers();
  const etherBalance = useEtherBalance(account);

  const switchToPolygon = async () => {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ chainId: '0x89', rpcUrl: process.env.NEXT_PUBLIC_INFURA_URL_POLYGON }],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }    
  }

  return (
    <Container className="mt-3">
      {account && isTestChain(chainId) && <Alert variant="info"><p className="m-0 p-0">You are currently on the <b>{getChainName(chainId)}</b> test network. All transactions are for testing purposes only!</p></Alert>}
      
      {account && chainId === ChainId.Mainnet && <Alert variant="primary" className="text-polygon">
        <p>CryptoWords uses the <a href="https://polygon.technology/" target="_blank" rel="noreferrer" className="color-polygon"><b>Polygon</b></a> network but you are currently on the Ethereum {getChainName(chainId)}. We use the Polygon network because gas fees on the Ethereum mainnet are simply too high. If mainnet gas fees trend lower on a long term basis, we may deploy there as well. For now, here we are!</p>
        <Button className="bg-polygon text-light border-polygon" size="lg" onClick={() => switchToPolygon()}>Switch to Polygon</Button>
      </Alert>}
      
      {account && chainId === ChainId.Polygon && etherBalance && Number(utils.formatEther(etherBalance.toString())).toFixed(4) == 0 && <Alert variant="primary" className="text-polygon">
        <Row>
          <Col xs="" sm="4" lg="3" xl="2">
            <a href="https://wallet.polygon.technology/bridge" target="_blank" rel="roreferrer" className="color-polygon">
              <img src="https://cryptowords.s3.amazonaws.com/production/poly-bridge.4aabe80.png" alt="Polygon Bridge logo" className="img-fluid" />
            </a>
          </Col>
          <Col>
            <p>You are currently on the <a href="https://polygon.technology/" target="_blank" rel="noreferrer" className="color-polygon"><b>{getChainName(chainId)}</b></a> network but do not have any funds to make a purchase. If you are new to the polygon network, you can transfer funds from the Ethereum mainnet by using the <a href="https://wallet.polygon.technology/bridge" target="_blank" rel="noreferrer" className="color-polygon"><b>Polygon Bridge</b></a></p>
            <p>We use the Polygon network because gas fees on the Ethereum mainnet are simply too high. If mainnet gas fees trend lower on a long term basis, we may deploy there as well. For now, here we are!</p>
          </Col>
        </Row>
      </Alert>}
    </Container>
  );
};

export default ChainChecker;