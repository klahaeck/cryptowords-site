import { useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
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

  const hasMetaMask = () => window.web3 || window.ethereum;

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

  const connectWalletLink = () => {
    const connector = new WalletLinkConnector({
      appName: 'CryptoWords',
    });

    activate(connector);
  };

  return (
    <Row className="g-1">
      {hasMetaMask() && <Col xs={24} sm={12}>
        <Card>
          <Card.Body role="button" onClick={connectMetaMask}>
            <div style={{backgroundImage: 'url("/images/MetaMask.svg")', backgroundRepeat:'no-repeat', backgroundPosition:'center', backgroundSize: '100%', minHeight:'80px'}} />
          </Card.Body>
        </Card>
      </Col>}
      <Col xs={24} sm={12}>
        <Card>
          <Card.Body role="button" onClick={connectWalletConnect}>
            <div style={{backgroundImage: 'url("/images/WalletConnect.svg")', backgroundRepeat:'no-repeat', backgroundPosition:'center', backgroundSize: '100%', minHeight:'80px'}} />
          </Card.Body>
        </Card>
      </Col>
      <Col xs={24} sm={12}>
        <Card>
          <Card.Body role="button" onClick={connectWalletLink}>
            <div style={{backgroundImage: 'url("/images/Coinbase.svg")', backgroundRepeat:'no-repeat', backgroundPosition:'center', backgroundSize: '100%', minHeight:'80px'}} />
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