import { useEthers } from '@usedapp/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  addToast,
  addAlert,
  removeToast,
  removeAlert,
  showModal,
} from '../store/root/reducer';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import {
  Container,
  Row,
  Col,
  Navbar,
  Button,
  Offcanvas,
} from 'react-bootstrap';
import { shortenAddress } from '../lib/utils';
import useHasRole from '../hooks/useHasRole';
import useAdminData from '../hooks/useAdminData';
import AdminTools from './AdminTools';
import ProfileTools from './ProfileTools';

const Menubar = (props) => {
  const { addToast, addAlert, showModal } = props;

  const connectWallet = () => activateBrowserWallet();
  // const disconnectWallet = () => {
  //   // deactivate();
  // };

  const { discountPercentage } = useAdminData();

  const { activateBrowserWallet, account } = useEthers();
  const hasDiscount = useHasRole('DISCOUNTED_ROLE', account);
  const isAdmin = useHasRole('DEFAULT_ADMIN_ROLE', account);

  const handleClickToCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    alert('Address copied');
  };

  const handleWalletInfo = () => {
    showModal({
      header:<><span className="fs-2 me-2">{shortenAddress(account)}</span> <Jazzicon diameter={28} seed={jsNumberForAddress(account)} /></>,
      body:<Row>
        <Col>
          <a role="button" onClick={() => handleClickToCopy(account)}><i className="bi bi-files"></i> Copy Address</a>
        </Col>
        <Col>
          <a href="https://etherscan.io/address/0x7dCF97A9D013a939e4E587b77481f73681A5aAc0" target="_blank" rel="noreferrer"><i className="bi bi-box-arrow-up-right"></i> View on Etherscan</a>
        </Col>
      </Row>,
      // footer:<Button variant="secondary" onClick={() => disconnectWallet()}>Disconnect</Button>,
      size:'md'
    });
  };

  return (
    <>
      {account && hasDiscount && <div className="p-0 m-0 bg-success text-light text-center">
        <p className="h4 p-2 m-0">You have a {discountPercentage * .01}% discount!</p>
      </div>}
      <Navbar bg="dark" expand={false} variant="dark" fixed="top">
        <Container>
          <Navbar.Brand href="/" className="me-auto">
            <span className="d-md-none">CW</span>
            <span className="d-none d-md-block">CryptoWords</span>
          </Navbar.Brand>
          {!account && <Button variant="primary" onClick={connectWallet}>Connect your wallet</Button>}
          {account && <Button onClick={handleWalletInfo}>
            <span className="me-2">{shortenAddress(account)}</span> <Jazzicon diameter={16} seed={jsNumberForAddress(account)} />
          </Button>}
          
          {account && isAdmin && <Navbar.Toggle aria-controls="offcanvasNavbar" className="ms-3" />}
          {account && isAdmin && <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">Admin</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {isAdmin && <AdminTools />}
              <ProfileTools />
            </Offcanvas.Body>
          </Navbar.Offcanvas>}
        </Container>
      </Navbar>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  addToast: bindActionCreators(addToast, dispatch),
  addAlert: bindActionCreators(addAlert, dispatch),
  removeToast: bindActionCreators(removeToast, dispatch),
  removeAlert: bindActionCreators(removeAlert, dispatch),
  showModal: bindActionCreators(showModal, dispatch),
});

export default connect(null, mapDispatchToProps)(Menubar);