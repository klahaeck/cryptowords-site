import { useEffect } from 'react';
import { useEthers, ChainId } from '@usedapp/core';
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
// import { WalletLinkConnector } from '@web3-react/walletlink-connector';
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

  const connectMetaMask = () => activateBrowserWallet();
  
  // const connectWalletConnect = () => {
  //   const connector = new WalletConnectConnector({
  //     rpc: {
  //       1: process.env.NEXT_PUBLIC_INFURA_URL_MAINNET,
  //       3: process.env.NEXT_PUBLIC_INFURA_URL_ROPSTEN,
  //       4: process.env.NEXT_PUBLIC_INFURA_URL_RINKEBY,
  //       137: process.env.NEXT_PUBLIC_INFURA_URL_POLYGON,
  //       80001: process.env.NEXT_PUBLIC_INFURA_URL_MUMBAI
  //     },
  //     supportedChainIds: [1, 3, 137, 80001],
  //     defaultChainId: ChainId.Polygon,
  //     chainId: ChainId.Polygon,
  //     bridge: 'https://bridge.walletconnect.org',
  //     qrcode: true,
  //     pollingInterval: 12000
  //   });

  //   activate(connector);
  // };

  // const connectWalletLink = () => {
  //   const connector = new WalletLinkConnector({
  //     appName: 'CryptoWords',
  //   });

  //   activate(connector);
  // };

  return (
    <Row className="g-1">
      {hasMetaMask() && <Col xs={24}>
        <Card>
          <Card.Body role="button" onClick={connectMetaMask}>
            <div style={{backgroundImage: 'url("https://cryptowords.s3.amazonaws.com/production/MetaMask.svg")', backgroundRepeat:'no-repeat', backgroundPosition:'center', backgroundSize: '100%', minHeight:'80px'}} />
          </Card.Body>
        </Card>
      </Col>}
      {/* <Col xs={24} sm={12}>
        <Card>
          <Card.Body role="button" onClick={connectWalletConnect}>
            <div style={{backgroundImage: 'url("https://cryptowords.s3.amazonaws.com/production/WalletConnect.svg")', backgroundRepeat:'no-repeat', backgroundPosition:'center', backgroundSize: '100%', minHeight:'80px'}} />
          </Card.Body>
        </Card>
      </Col> */}
      {/* <Col xs={24} sm={12}>
        <Card>
          <Card.Body role="button" onClick={connectWalletLink}>
            <div style={{backgroundImage: 'url("https://cryptowords.s3.amazonaws.com/production/Coinbase.svg")', backgroundRepeat:'no-repeat', backgroundPosition:'center', backgroundSize: '100%', minHeight:'80px'}} />
          </Card.Body>
        </Card>
      </Col> */}
    </Row>
  );
};

const mapDispatchToProps = (dispatch) => ({
  hideModal: bindActionCreators(hideModal, dispatch),
});

export default connect(null, mapDispatchToProps)(WalletConnectors);