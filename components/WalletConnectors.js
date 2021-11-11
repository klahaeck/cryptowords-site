import { useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  hideModal,
} from '../store/root/reducer';
import {
  Row,
  Col,
  Card
} from 'react-bootstrap';

const WalletConnectors = ({ hideModal }) => {
  const { account, activateBrowserWallet, activate } = useEthers();

  useEffect(() => {
    if (account) hideModal();
  }, [account]);

  const connectMetaMask = () => {
    activateBrowserWallet();
  };
  
  const connectWalletConnect = () => {
    const connector = new WalletConnectConnector({
      rpc: {
        1: process.env.NEXT_PUBLIC_INFURA_URL_MAINNET,
        4: process.env.NEXT_PUBLIC_INFURA_URL_RINKEBY
      },
      supportedChainIds: [1, 4],
      defaultChainId: 4,
      chainId: 4,
      // bridge: 'https://bridge.walletconnect.org',
      qrcode: true,
      pollingInterval: 12000
    });

    activate(connector);
  };

  return (
    <Row>
      <Col className="text-center">
        <Card>
          <Card.Body role="button" onClick={connectMetaMask}>
            <img src="/images/MetaMask.svg" alt="MetaMask" />
          </Card.Body>
        </Card>
      </Col>
      <Col className="text-center">
        <Card>
          <Card.Body role="button" onClick={connectWalletConnect}>
            <img src="/images/WalletConnect.svg" alt="WalletConnect" />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

const mapDispatchToProps = (dispatch) => ({
  hideModal: bindActionCreators(hideModal, dispatch),
});

export default connect(null, mapDispatchToProps)(WalletConnectors);